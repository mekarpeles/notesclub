import * as React from 'react'
import axios from 'axios';
import { apiDomain } from './appConfig';
import exerciseInterface from './exerciseInterface';
import OpenCloze from './OpenCloze';
import KeyWordTransformationExercise from './KeyWordTransformationExercise';
import keyWordTransformationInterface from './keyWordTransformationInterface'
import openClozeInterface from './openClozeInterface'
import userInterface from './userInterface'


interface IProps {
  updateAlert: Function
}

interface IState {
  exercises: exerciseInterface[]
  users: userInterface[]
}

function isOpenCloze(data: openClozeInterface | keyWordTransformationInterface): data is openClozeInterface {
  return (data as openClozeInterface)["text"] !== undefined
}

class Exercises extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      exercises: [],
      users: []
    }

    this.fetchExercises()
  }


  fetchUsers = (userIds: number[]) => {
    axios.get(apiDomain() + "/v1/users?ids=" + userIds.join(","), { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        let usersHash: { [key: string]: userInterface } = {}
        const users = res.data.map((user: any) => {
          const userData: userInterface = {
            id: user["id"],
            name: user["name"],
            username: user["username"],
            createdAt: user["created_at"]
          }
          usersHash[userData["id"]] = userData
          return (
            userData
          )
        })
        this.setState({ users: users })
      })
      .catch(res => {
        this.props.updateAlert("danger", "There was an error.")

        console.log("error")
        console.log(res)
      })
  }

  fetchExercises = () => {
    axios.get(apiDomain() + "/v1/exercises", { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        console.log(res)
        console.log(res.data)
        const exercises = res.data.map((ex: any) => {
          const data = JSON.parse(ex["data"])
          return (
            {
              id: ex["id"],
              name: ex["name"],
              data: data,
              createdAt: ex["created_at"],
              createdById: ex["created_by_id"],
              // createdByName: usersHash[ex["id"]]["name"]
            }
          )
        })
        this.setState({ exercises: exercises })
        const userIds = exercises.map((ex: any) => ex.createdById)
        this.fetchUsers(userIds)
      })
      .catch(res => {
        this.props.updateAlert("danger", "There was an error loading exercises.")

        console.log("error")
        console.log(res)
      })
  }

  renderUserName = (userId: number) => {
    const { users } = this.state
    const user = users.filter((user) => user.id === userId)[0]
    return(
      user ? user.name || user.username : userId
    )
  }
  renderExerciseFooter = (exercise: exerciseInterface) => {
    return (
      <div className="container exercise-footer">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-lg-6">
            Created by {this.renderUserName(exercise.createdById)} · {
              new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "long",
                day: "2-digit"
              }).format(Date.parse(exercise.createdAt))
            }
          </div>
          <div className="col-lg-4">
          </div>
        </div>
      </div>
    )
  }

  renderExercise = (exercise: exerciseInterface) => {
    return (
      <>
        {this.renderExerciseCore(exercise)}
        {this.renderExerciseFooter(exercise)}
      </>
    )
  }
  renderExerciseCore = (exercise: exerciseInterface) => {
    const data: openClozeInterface | keyWordTransformationInterface = exercise["data"]
    if (exercise["name"] === "OpenCloze"){
      const d = data as openClozeInterface
      return(
        <OpenCloze text = { d.text } solutions = { d.solutions } title = { d.title } description = { d.description } />
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
