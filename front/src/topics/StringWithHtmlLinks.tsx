import * as React from 'react'

interface StringWithHtmlLinksProps {
  element: string
}

interface StringWithHtmlLinksState {
}

class StringWithHtmlLinks extends React.Component<StringWithHtmlLinksProps, StringWithHtmlLinksState> {
  readonly HTML_LINK_REGEX = /(https?:\/\/[^\s]*)/

  public render () {
    const { element } = this.props
    const arr = element.split(this.HTML_LINK_REGEX)

    return (
      <>
        {arr.map((e, index) => {
          if (index % 2 === 0) {
            return (<span key={index}>{e}</span>)
          } else {
            const e_shortened = e.length > 50 ? e.slice(0, 50) + "..." : e

            return (
              <span key={index}>
                {e_shortened}
                {" ("}
                <a href={e} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>open</a>
                {")"}
              </span>
            )
          }
        })}
      </>
    )
  }
}

export default StringWithHtmlLinks
