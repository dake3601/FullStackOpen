import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'A Guide on React',
    author: 'First Last',
    url: 'https://reactjs.org/',
    likes: 10
  }

  const { container } = render(<Blog blog={blog} />)

  const divShow = container.querySelector('.blogShow')
  expect(divShow).toHaveStyle('display: none')
  expect(divShow).toHaveTextContent('A Guide on React')
  expect(divShow).toHaveTextContent('First Last')
  expect(divShow).toHaveTextContent('https://reactjs.org/')
  expect(divShow).toHaveTextContent('10')

  const divHide = container.querySelector('.blogHide')
  expect(divHide).toHaveStyle('display: block')
  expect(divHide).toHaveTextContent('A Guide on React')
  expect(divHide).toHaveTextContent('First Last')
  expect(divHide).not.toHaveTextContent('https://reactjs.org/')
  expect(divHide).not.toHaveTextContent('10')
})
