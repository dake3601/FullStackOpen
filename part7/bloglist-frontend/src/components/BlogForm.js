import { useState } from 'react'
import { TextField, Stack, Text, PrimaryButton } from '@fluentui/react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const columnProps = {
    tokens: { childrenGap: 5 },
    styles: { root: { width: 300 } }
  }

  return (
    <div style={{ width: 500 }}>
      <Text variant="xLarge">Create new</Text>
      <form onSubmit={addBlog}>
        <Stack {...columnProps}>
          <TextField
            label="Title:"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            id="title-input"
          />
          <TextField
            label="Author:"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            id="author-input"
          />
          <TextField
            label="URL:"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            id="url-input"
          />
        </Stack>
        <PrimaryButton
          style={{ marginTop: 5 }}
          text="create"
          type="submit"
          id="create-blog"
        />
      </form>
    </div>
  )
}

export default BlogForm
