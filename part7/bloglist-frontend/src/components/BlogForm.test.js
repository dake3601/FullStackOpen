import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('form calls the event handler with correct data', () => {
    const createBlog = jest.fn()
    const { container } = render(<BlogForm createBlog={createBlog} />)
    const button = screen.getByText('create')
    const inputTitle = container.querySelector('#title-input')
    const inputAuthor = container.querySelector('#author-input')
    const inputUrl = container.querySelector('#url-input')

    userEvent.type(inputTitle, 'A Guide on React')
    userEvent.type(inputAuthor, 'First Last')
    userEvent.type(inputUrl, 'https://reactjs.org/')
    userEvent.click(button)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('A Guide on React')
    expect(createBlog.mock.calls[0][0].author).toBe('First Last')
    expect(createBlog.mock.calls[0][0].url).toBe('https://reactjs.org/')
  })
})
