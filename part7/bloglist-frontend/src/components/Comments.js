import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { commentBlog } from '../reducers/blogReducer'
import {
  Text,
  TextField,
  Stack,
  DefaultButton,
  mergeStyleSets,
  getTheme,
  List,
  FontIcon
} from '@fluentui/react'

const theme = getTheme()
const { semanticColors, fonts } = theme

const classNames = mergeStyleSets({
  itemCell: {
    minHeight: 30,
    padding: 10,
    boxSizing: 'border-box',
    border: `1px solid ${semanticColors.bodyDivider}`,
    display: 'flex',
    overflow: 'hidden',
    flexGrow: 1,
    marginBottom: 5,
    whiteSpace: 'pre-wrap'
  },
  itemName: [
    fonts.medium,
    {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  ],
  iconClass: {
    fontSize: 10,
    height: 10,
    width: 10,
    margin: '5px 15px'
  }
})

const CommentsForm = ({ id }) => {
  const dispatch = useDispatch()

  const [comment, setComment] = useState('')

  const handleComment = async (event) => {
    event.preventDefault()
    dispatch(commentBlog(id, { comment }))
    setComment('')
  }
  return (
    <div>
      <form onSubmit={handleComment}>
        <Stack horizontal>
          <TextField
            id="comment"
            type="text"
            value={comment}
            name="Comment"
            onChange={({ target }) => setComment(target.value)}
            styles={{ root: { width: '30em' } }}
          />
          <DefaultButton
            text="add comment"
            type="submit"
            styles={{ root: { height: '2.3em', width: '10em' } }}
          />
        </Stack>
      </form>
    </div>
  )
}

const Comments = ({ blog }) => {
  const onRenderCell = (item) => {
    return (
      <div className={classNames.itemCell}>
        <FontIcon iconName="CircleFill" className={classNames.iconClass} />
        <div>{item.comment}</div>
      </div>
    )
  }
  return (
    <Stack tokens={{ childrenGap: 's1' }}>
      <Text variant="large">Comments</Text>
      <CommentsForm id={blog.id} />
      <List items={blog.comments} onRenderCell={onRenderCell} />
    </Stack>
  )
}

export default Comments
