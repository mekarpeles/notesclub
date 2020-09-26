import * as React from 'react'

interface TermsProps {
}

interface TermsState {
}

class Terms extends React.Component<TermsProps, TermsState> {
  constructor(props: TermsProps) {
    super(props)

    this.state = {
    }
  }

  componentDidMount() {
  }

  public render() {
    return (
      <div className="container">
        <h1>Terms and Conditions ("Terms")</h1>
        <p>Last updated: 25/9/2020</p>
        <p>Please read these Terms and Conditions carefully before using the https://book.notes.club website</p>
        <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service. By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

        <p><b>Content</b></p>
        <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the legality of them.</p>
        <p>All the content you write on Book Notes Club can be accessed by any other Book Notes Club member. Also, every month we'll <b>release all notes</b> with a <b>Creative Commons</b> or public domain license.</p>

        <p><b>Links To Other Web Sites</b></p>
        <p>Our Service may contain links to third­party web sites or services that are not owned or controlled by Book Notes Club.</p>
        <p>Book Notes Club has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that Book Notes Club shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>

        <p><b>Changes</b></p>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 (change this) days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

        <p><b>Contact Us</b></p>
        <p>If you have any questions about these Terms, please contact us: book@notes.club</p>
      </div>
    )
  }
}

export default Terms
