import * as React from 'react';
import './App.css';
import KeyWordTransformationExercise from './KeyWordTransformationExercise';
import MultipleChoiceClozeExercise from './MultipleChoiceClozeExercise';
import OpenCloze from './OpenCloze';
import Header from './Header';

class App extends React.Component {
  public render() {
    const solutions = ["a good idea to go"]
    const text2 = "Genealogy is a (0) ........ of history. It concerns family history, (1) ........ than the national or world history studied at school. It doesn't merely involve drawing a family tree, however - tracing your family history can also (2) ........ in learning about your roots and identity. The Internet enables millions of people worldwide to (3) ........ information about their family history, without great (4) ........ \n\n People who research their family history often (5) ........ that it's a fascinating hobby which (6) ........ a lot about where they come from and whether they have famous ancestors. According to a survey involving 900 people who had researched their family history, the chances of discovering a celebrity in your past are one in ten. The survey also concluded that the (7) ........ back you follow your family line, the more likely you are to find a relation who was much wealthier than you are. However, the vast majority of people who (8) ........ in the survey discovered they were better off than their ancestors."
    const options2 = [["band", "set", "branch", "series"], ["instead", "rather", "except", "sooner"], ["cause", "mean", "result", "lead"], ["accomplish", "access", "approach", "admit"], ["fee", "price", "charge", "expense"], ["describe", "define","remark", "regard"], ["reveals", "opens", "begins", "arises"], ["older", "greater", "higher", "further"], ["attended", "participated", "included", "associated"]]
    const solutions2 = [2, 1, 2, 1, 3, 2, 0, 3, 1]
    const text3 = "When the day comes give yourself plenty of time (0) ........ do everything: have breakfast but don't drink (1) ........ much; go to the toilet; arrive on time, but not too early or you will find yourself getting more and more nervous while you wait to start.\n\nIn the exam, calm (2) ........ down by breathing deeply and thinking positively. Read the exam questions carefully and underline all of the key instruction words (3) ........ indicate how the questions should be answered.If possible start with the ones (4) ........ can do easily to give you confidence. Remember what you've learnt from practising questions and doing mock exams previously and plan your use of time. Don't panic (5) ........ everyone around you seems to start writing furiously straight away and don't be tempted to follow their example. \n\n Finally, after the exam, don't join in a discussion about (6) ........ everyone else did, (7) ........ you want to frighten yourself, and drain your self-confidence for the next exam. Above (8) ........, remember that exams are not designed to catch you out, but to find out what you know, what you understand and what you can do."
    return (
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
        <OpenCloze text={text3}></OpenCloze>
        <KeyWordTransformationExercise description="Write a second sentence so that it has a similar meaning to the first sentence, using the word given. Do not change the word given. You must use between three and six words, including the word given." originalSentence="I was in favour of going to the cinema." word="IDEA" part1="I thought it would be" part2="to the cinema." solutions={solutions} />
        <MultipleChoiceClozeExercise text={text2} options={options2} description="Read the text below and click on the answer at the bottom that best fits each gap. There is an example at the beginning (0)." solutions={solutions2}/>
      </div>
    );
  }
}

export default App;
