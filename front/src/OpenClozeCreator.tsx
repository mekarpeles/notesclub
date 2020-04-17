import * as React from 'react'
import { Form, Button } from 'react-bootstrap'
import OpenCloze from './OpenCloze'
import { humanize } from './stringTools'
import '@ionic/react/css/core.css'
import { AxiosResponse } from 'axios'
import { IonIcon, IonDatetime } from '@ionic/react';
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons'
import { apiDomain } from './appConfig'
import axios from 'axios'

interface IProps {
  updateAlert: Function
}

interface IState {
  title: string
  description: string
  text: string
  solutions: string[]
  showPreview: boolean
}

class KeyWordTransformationCreator extends React.Component<IProps, IState> {
  static readonly initialState = {
    title: "Open Cloze",
    description: "",
    text: "",
    solutions: [],
    showPreview: false
  }

  constructor(props: IProps) {
    super(props)

    this.state = KeyWordTransformationCreator.initialState
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
    const name = target.name
    const content = value.split(/\(\d+\)\ \.\.\.\.\.+/).join('.....').split(/\.\.\.\.\.+/)
    let new_value = ""
    const content_length = content.length
    content.map((a, index) => {
      if (index > 0 && index < content_length) {
        new_value = new_value + "(" + index + ") ....." + a
      } else {
        new_value = new_value + a
      }
    })
    let { solutions } = this.state
    while (solutions.length < content_length - 1) {
      solutions = solutions.concat([""])
    }
    while (solutions.length > content_length - 1) {
      solutions.pop()
    }

    this.setState((prevState) => ({
      ...prevState,
      [name]: new_value
    }))
    this.setState({ solutions: solutions })
  }

  renderInput = (fieldName: string) => {
    const value = eval("this.state." + fieldName) // Is there sth like "send" from ruby so we don't need to use eval?
    return (
      <Form.Group>
        <Form.Label className="label-creator">{humanize(fieldName)}:</Form.Label>
        <Form.Control
          type="text"
          value={value}
          name={fieldName}
          onChange={this.handleChange as any} />
      </Form.Group>
    )
  }

  renderTextArea = (fieldName: string, rows: number) => {
    const value = eval("this.state." + fieldName) // Is there sth like "send" from ruby so we don't need to use eval?
    return (
      <Form.Group>
        <Form.Label>{humanize(fieldName)}:</Form.Label>
        <Form.Control
          as="textarea"
          value={value}
          rows={rows}
          name={fieldName}
          onChange={this.handleChange as any} />
      </Form.Group>
    )
  }

  renderText = () => {
    const { text } = this.state
    return (
      <Form.Group>
        <Form.Label>Text with gaps:</Form.Label>
        <Form.Text className="text-muted">Each gap must have five dots. E.g. When ..... we three meet again in thunder, lightning, or in rain?</Form.Text>
        <Form.Control
          as="textarea"
          value={text}
          rows="10"
          name="text"
          onChange={this.handleChange as any} />
      </Form.Group>
    )
  }

  renderSolutions = () => {
    const { solutions } = this.state
    const renderedSolutions = solutions.map((solution, index) => this.renderSolution(solution, index))
    return (
      <>
        { renderedSolutions }
      </>
    )
  }

  handleSolutionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
    const index = Number(target.name.split("_")[1])
    const { solutions } = this.state
    solutions[index - 1] = value
    this.setState({ solutions: solutions })
  }

  renderSolution = (solution: string, index: number) => {
    return (
      <Form.Group key={"solution_" + String(index + 1)}>
        <Form.Label>{"Solution (" + String(index + 1) + "):"}</Form.Label>
        <Form.Text className="text-muted">Separate multiple valid solutions with vertical bars. E.g. shall | could</Form.Text>
        <Form.Control
          type="text"
          value={solution}
          name={"solution_" + String(index + 1)}
          onChange={this.handleSolutionChange as any} />
      </Form.Group>
    )
  }

  transformSolutions = (solutions: string[]) => {
    return (
      solutions.map((s) => s.split('|').map((sol) => sol.trim()))
    )
  }

  create = () => {
    const { title, description, text, solutions } = this.state
    const data = {
      title: title,
      description: description,
      text: text,
      solutions: this.transformSolutions(solutions)
    }
    const json_data = JSON.stringify(data)
    console.log(data)
    const params = {
      name: "OpenCloze",
      data: json_data
    }
    axios.post(apiDomain() + "/v1/exercises", params, { withCredentials: true })
      .then(res => {
        this.props.updateAlert("success", "Exercise created.")
        console.log(res)
        console.log(res.data)
        this.setState(KeyWordTransformationCreator.initialState)
      })
      .catch(res => {
        const errors = res.response.data["errors"]
        let msg = ""
        if (errors && errors["data"]) {
          errors["data"].forEach((error: string) => {
            msg = msg + humanize(error) + " "
          })
        } else {
          msg = "Unknown error."
        }

        this.props.updateAlert("danger", msg)

        console.log("error:");
        console.log(res.response.data["errors"]);
      })
  }

  togglePreview = () => {
    this.setState({ showPreview: !this.state.showPreview })
  }

  public render() {
    const { title, description, text, solutions, showPreview } = this.state

    const sol = this.transformSolutions(solutions)

    return (
      <>
        <div className="exercise container">
          <div className="row">
            <div className="col-lg-3"></div>
            <div className="col-lg-6">
              {this.renderInput("title")}
              {this.renderTextArea("description", 3)}
              {this.renderText()}
              {this.renderSolutions()}
              <div>
                <Button onClick={this.create}>Create</Button>
              </div>
            </div>
            <div className="col-lg-3"></div>
          </div>
        </div>
        <div className="preview text-center">
          <Button onClick={this.togglePreview} variant="link">{showPreview ? "Hide" : "Show"} preview</Button>
          {showPreview ? <OpenCloze title={title} description={description} text={text} solutions={sol} /> : <></>}
        </div>
      </>
    )
  }
}

export default KeyWordTransformationCreator
