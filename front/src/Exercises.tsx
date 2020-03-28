import * as React from 'react'
import axios from 'axios';
import { apiDomain } from './appConfig';
import exerciseInterface from './exerciseInterface';
import OpenCloze from './OpenCloze';
import KeyWordTransformationExercise from './KeyWordTransformationExercise';
import keyWordTransformationInterface from './keyWordTransformationInterface'
import openClozeInterface from './openClozeInterface'


interface IProps {
  updateAlert: Function
}

interface IState {
  exercises: exerciseInterface[]
}

function isOpenCloze(data: openClozeInterface | keyWordTransformationInterface): data is openClozeInterface {
  return (data as openClozeInterface)["text"] !== undefined
}

class Exercises extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      exercises: []
    }

    this.fetchExercises()
  }

  fetchExercises = () => {
    axios.get(apiDomain() + "/v1/exercises", { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        console.log(res)
        console.log(res.data)
        const exercises = res.data.map((ex: any) => {
          const data = JSON.parse(ex["data"])
          return(
            {
              id: ex["id"],
              name: ex["name"],
              data: data
            }
          )
        })
        this.setState({ exercises: exercises })
      })
      .catch(res => {
        this.props.updateAlert("danger", "There was an error loading exercises.")

        console.log("error")
        console.log(res)
      })
  }

  renderExercise = (exercise: exerciseInterface) => {
    // return(
    //   <></>
    // )
    const data: openClozeInterface | keyWordTransformationInterface = exercise["data"]
    if (exercise["name"] === "OpenCloze"){
      const d = data as openClozeInterface
      return(
        <OpenCloze text = { d["text"] } solutions = { d["solutions"] } title = { d["title"] } description = { d["description"] } />
      )
    }else if (exercise["name"] === "KeyWordTransformation"){
      const d = data as keyWordTransformationInterface
      return(
        <KeyWordTransformationExercise title={d["title"]} description={d["description"]} originalSentence={d["originalSentence"]} part1={d["part1"]} word={d["word"]} part2={d["part2"]} solutions={d["solutions"]}/>
      )
    }else{
      return(
        <></>
      )
    }
  }

  public render() {
    const { exercises } = this.state

    return (
      exercises.map((ex) => this.renderExercise(ex))
    )
  }
}

export default Exercises
