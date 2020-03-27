import * as React from 'react'
import { Form, Button } from 'react-bootstrap'
import OpenCloze from './OpenCloze'
import { humanize } from './stringTools'
import '@ionic/react/css/core.css';

import { IonIcon, IonDatetime } from '@ionic/react';
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons'

interface IProps {
  createExercise: Function
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
  constructor(props: IProps) {
    super(props)

    this.state = {
      title: "Open Cloze",
      description: "Use the word given in capitals to form a word that fits in the gap. There is an example at the beginning (0).",
      text: "",
      solutions: [""],

      showPreview: false
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
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
        <Form.Text className="text-muted">Each gap must be preceded by a number in parentheses and three dots. E.g. When (0) ... we three meet again in thunder, lightning, or in rain?</Form.Text>
        <Form.Control
          as="textarea"
          value={text}
          rows="10"
          name="text"
          onChange={this.handleChange as any} />
      </Form.Group>
    )
  }

  addSolution = () => {
    this.setState({ solutions: this.state.solutions.concat([""]) })
  }

  removeSolution = () => {
    let solutions = this.state.solutions
    if(solutions.length > 1){
      solutions.pop()
      this.setState({ solutions: solutions })
    }else{
      this.props.updateAlert("danger", "You must have at least one solution.")
    }
  }

  renderSolutions = () => {
    const { solutions } = this.state
    const renderedSolutions = solutions.map((solution, index) => this.renderSolution(solution, index))
    return (
      <>
        { renderedSolutions }
        <IonIcon onClick={this.addSolution} icon={addCircleOutline} size="large" />
        <IonIcon onClick={this.removeSolution} icon={removeCircleOutline} size="large" />
      </>
    )
  }

  handleSolutionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
    const index = Number(target.name.split("_")[1])
    const { solutions } = this.state
    solutions[index] = value
    this.setState({ solutions: solutions })
  }

  renderSolution = (solution: string, index: number) => {
    return (
      <Form.Group>
        <Form.Label>{"Solution (" + String(index) + "):"}</Form.Label>
        <Form.Text className="text-muted">Separate multiple valid solutions with vertical bars. E.g. shall | could</Form.Text>
        <Form.Control
          type="text"
          value={solution}
          name={"solution_" + String(index)}
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
    this.props.createExercise("OpenCloze", json_data)
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
