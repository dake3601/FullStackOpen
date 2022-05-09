import { Stack, Text, List, getTheme, mergeStyleSets } from '@fluentui/react'

const theme = getTheme()
const { semanticColors, fonts } = theme

const classNames = mergeStyleSets({
  itemCell: {
    minHeight: 30,
    padding: 10,
    boxSizing: 'border-box',
    borderBottom: `1px solid ${semanticColors.bodyDivider}`,
    display: 'flex',
    marginLeft: 10,
    overflow: 'hidden',
    flexGrow: 1
  },
  itemName: [
    fonts.medium,
    {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  ]
})

const User = ({ user }) => {
  if (!user) {
    return null
  }

  const onRenderCell = (item) => {
    return (
      <div className={classNames.itemCell}>
        <div className={classNames.itemName}>{item.title}</div>
      </div>
    )
  }

  return (
    <Stack tokens={{ childrenGap: 'm' }}>
      <Text variant="xLarge">{user.name}</Text>
      <Text variant="large">Added Blogs</Text>
      <List items={user.blogs} onRenderCell={onRenderCell} />
    </Stack>
  )
}

export default User
