import * as React from 'react'
import { Form, Button } from 'react-bootstrap'
import KeyWordTransformationExercise from './KeyWordTransformationExercise';

interface IProps {

}

interface IState {
  title: string
  description: string
  originalSentence: string
  word: string
  part1: string
  part2: string
  solutions: string[]
}

class KeyWordTransformationCreator extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      originalSentence: "I was in favour of going to the cinema.",
      word: "IDEA",
      part1: "I thought it would be",
      part2: "to the cinema.",
      solutions: ["a good idea to go", "to go"],
      description: "Write a second sentence so that it has a similar meaning to the first sentence, using the word given. Do not change the word given. You must use between three and six words, including the word given.",
      title: "Key Word Transformation"
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
    const value = eval("this.state." + fieldName)
    return (
      <Form.Group className="">
        <Form.Label>{fieldName}:&nbsp;</Form.Label>
        <Form.Control
          type="text"
          value={value}
          name={fieldName}
          onChange={this.handleChange as any} />
      </Form.Group>
    )
  }


  renderTextArea = (fieldName: string) => {
    const value = eval("this.state." + fieldName)
    return (
      <Form.Group className="">
        <Form.Label>{fieldName}:&nbsp;</Form.Label>
        <Form.Control
          as="textarea"
          value={value}
          name={fieldName}
          onChange={this.handleChange as any} />
      </Form.Group>
    )
  }

  create = () => {
    const { title, description, originalSentence, part1, word, part2, solutions } = this.state

    const data = {
      title: title,
      description: description,
      originalSentence: originalSentence,
      part1: part1,
      word: word,
      part2: part2,
      solutions: solutions
    }

    JSON.stringify(data)
  }

  public render() {
    const { title, description, originalSentence, part1, word, part2, solutions } = this.state

    return (
      <>
        <div className="exercise container">
          <div className="row">
            <div className="col-lg-3"></div>
            <div className="col-lg-6">
              {this.renderInput("title")}
              {this.renderTextArea("description")}
              {this.renderInput("originalSentence")}
              {this.renderInput("word")}
              {this.renderInput("part1")}
              {this.renderInput("part2")}
              <Button onClick={this.create}>Create</Button>
            </div>
            <div className="col-lg-3"></div>
          </div>
        </div>
        <div className="preview">
          Preview:
          <KeyWordTransformationExercise title={title} description={description} word={word} part1={part1} part2={part2} solutions={solutions} originalSentence = {originalSentence}/>
        </div>
      </>
    )
  }
}

export default KeyWordTransformationCreator
