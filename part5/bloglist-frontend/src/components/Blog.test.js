import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'A Guide on React',
    author: 'First Last',
    url: 'https://reactjs.org/',
    likes: 10
  }

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
      />
    ).container
  })

  test('at start render title and author only', () => {
    const divShow = container.querySelector('.blogShow')
    expect(divShow).toHaveStyle('display: none')
    expect(divShow).toHaveTextContent('A Guide on React')
    expect(divShow).toHaveTextContent('First Last')
    expect(divShow).toHaveTextContent('https://reactjs.org/')
    expect(divShow).toHaveTextContent('10')

    const divHide = container.querySelector('.blogHide')
    expect(divHide).not.toHaveStyle('display: none')
    expect(divHide).toHaveTextContent('A Guide on React')
    expect(divHide).toHaveTextContent('First Last')
    expect(divHide).not.toHaveTextContent('https://reactjs.org/')
    expect(divHide).not.toHaveTextContent('10')
  })

  test('after clicking the button, url and likes are displayed', () => {
    const button = screen.getByText('view')
    userEvent.click(button)

    const divShow = container.querySelector('.blogShow')
    expect(divShow).not.toHaveStyle('display: none')
    expect(divShow).toHaveTextContent('A Guide on React')
    expect(divShow).toHaveTextContent('First Last')
    expect(divShow).toHaveTextContent('https://reactjs.org/')
    expect(divShow).toHaveTextContent('10')

    const divHide = container.querySelector('.blogHide')
    expect(divHide).toHaveStyle('display: none')
    expect(divHide).toHaveTextContent('A Guide on React')
    expect(divHide).toHaveTextContent('First Last')
    expect(divHide).not.toHaveTextContent('https://reactjs.org/')
    expect(divHide).not.toHaveTextContent('10')
  })
})
