import * as React from 'react';
import './App.css';
import KeyWordTransformationExercise from './KeyWordTransformationExercise';
import Login from './Login';
import MultipleChoiceClozeExercise from './MultipleChoiceClozeExercise';
import OpenCloze from './OpenCloze';
import Header from './Header';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

interface User {
  id: number
  email: string
  username: string
  name: string
}

interface AppProps {

}

interface AppState {
  user?: User
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    const currentUserStr = localStorage.getItem('current_user')

    this.state = {
      user: currentUserStr ? JSON.parse(currentUserStr) : undefined
    }
  }
  setCurrentUser = (user: User) => {
    this.setState({ user: user })
    localStorage.setItem('current_user', JSON.stringify(user))
  }

  test = () => {
    // axios.defaults.withCredentials = true
    axios.get(`http://localhost:3000/api/users/1`, { withCredentials: true })
      .then(res => {
        console.log(res)
        console.log(res.data)
      })
      .catch(res => {
        console.log("error ");
        console.log(res);
      })
  }

  public render() {
    const title1 = "Key Word Transformation"
    const description1 = "Write a second sentence so that it has a similar meaning to the first sentence, using the word given. Do not change the word given. You must use between three and six words, including the word given."
    const word1 = "IDEA"
    const part1 = "I thought it would be"
    const part2 = "to the cinema."
    const solutions1 = ["a good idea to go", "to go"]
    const originalSentence = "I was in favour of going to the cinema."

    const title2 = "Multiple Choice Cloze"
    const description2 = "Read the text below and click on the answer at the bottom that best fits each gap. There is an example at the beginning (0)."
    const text2 = "Genealogy is a (0) ........ of history. It concerns family history, (1) ........ than the national or world history studied at school. It doesn't merely involve drawing a family tree, however - tracing your family history can also (2) ........ in learning about your roots and identity. The Internet enables millions of people worldwide to (3) ........ information about their family history, without great (4) ........ \n\n People who research their family history often (5) ........ that it's a fascinating hobby which (6) ........ a lot about where they come from and whether they have famous ancestors. According to a survey involving 900 people who had researched their family history, the chances of discovering a celebrity in your past are one in ten. The survey also concluded that the (7) ........ back you follow your family line, the more likely you are to find a relation who was much wealthier than you are. However, the vast majority of people who (8) ........ in the survey discovered they were better off than their ancestors."
    const options2 = [["band", "set", "branch", "series"], ["instead", "rather", "except", "sooner"], ["cause", "mean", "result", "lead"], ["accomplish", "access", "approach", "admit"], ["fee", "price", "charge", "expense"], ["describe", "define","remark", "regard"], ["reveals", "opens", "begins", "arises"], ["older", "greater", "higher", "further"], ["attended", "participated", "included", "associated"]]
    const solutions2 = [2, 1, 2, 1, 3, 2, 0, 3, 1]

    const title3 = "Open Cloze"
    const text3 = "I work (0) ... a motorbike stunt rider - that is, I do tricks on my motorbike at shows. The Le Mans racetrack in France was (1) ........ I first saw some guys doing motorbike stunts. I'd never seen anyone riding a motorbike using just the back wheel before and I was (2) ........ impressed I went straight home and taught (3) ........ to do the same. It wasn't very long before I began to earn my living at shows performing my own motorbike stunts.\n\nI have a degree (4) ....... mechanical engineering; this helps me to look at the physics (5) ........ lies behind each stunt. In addition to being responsible for design changes to the motorbike, I have to work (6) ........ every stunt I do. People often think that my work is very dangerous, but, apart (7) ........ some minor mechanical problem happening occasionally during a stunt, nothing ever goes wrong. I never feel in (8) ........ kind of danger because I'm very experienced."
    const description3 = "Read the text below and think of a word which best fits each gap.Use only one word in each gap.There is an example at the beginning(0)."
    const solutions3 = [["as"], ["where"], ["so"], ["myself"], ["in"], ["which", "that"], ["out", "on", "at"], ["from"], ["any"]]

    const title4 = "Word Formation"
    const text4 = "Garlic, a member of the Lilliaceae family which also includes onions, is (0) ........ (COMMON) used in cooking all around the world. China is currently the largest (1) ........ (PRODUCT) of garlic, which is particularly associated with the dishes of northern Africa and southern Europe. It is native to central Asia and has long had a history as a health-giving food, used both to prevent and cure (2) ......... (ILL) In ancient Egypt, workers building the pyramids were given garlic to keep them strong, while Olympic athletes in Greece ate it to increase their resistance to infection. The forefather of antibiotic medicine, Louis Pasteur, claimed garlic was as (3) ........ (EFFECT) as penicillin in treating infections. Modern-day (4) ........ (SCIENCE) have proved that garlic can indeed kill bacteria and even some viruses, so it can be very useful for people who have coughs and colds. In (5) ........ (ADD), some doctors believe that garlic can reduce blood (6) ........ (PRESS) The only (7) ........ (ADVANTAGE) to this truly amazing food is that the strong and rather (8) ........ (SPICE) smell of garlic is not the most pleasant!"
    const description4 = "Use the word given in capitals to form a word that fits in the gap. There is an example at the beginning (0)."
    const solutions4 = [["commonly"], ["producer"], ["illness", "illnesses"], ["effective"], ["scientists"], ["addition"], ["pressure"], ["disadvantage"], ["spicy"]]

    const { user } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
        {user ? "Hi" : <Login setCurrentUser={this.setCurrentUser} />}
        <Button onClick={this.test}>Test</Button>
        {/* <OpenCloze text={text4} solutions={solutions4} title={title4} description={description4} /> */}
        {/* <OpenCloze text={text3} solutions={solutions3} title={title3} description={description3} /> */}
        {/* <KeyWordTransformationExercise title={title1} description={description1} word={word1} part1={part1} part2={part2} solutions={solutions1} originalSentence = {originalSentence}/> */}
        <MultipleChoiceClozeExercise title={title2} text={text2} options={options2} description={description2} solutions={solutions2}/>
      </div>
    );
  }
}

export default App;
