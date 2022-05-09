import { useNavigate } from 'react-router-dom'
import {
  Text,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Link
} from '@fluentui/react'

const UsersPage = ({ users }) => {
  const navigate = useNavigate()
  const columns = [
    {
      key: 'column1',
      name: 'Name',
      fieldName: 'name',
      minWidth: 150,
      maxWidth: 150,
      onRender: (item) => {
        return (
          <Link onClick={() => navigate(`/users/${item.key}`)}>
            {item.name}
          </Link>
        )
      }
    },
    {
      key: 'column2',
      name: 'Blogs created',
      fieldName: 'count',
      minWidth: 100,
      maxWidth: 100
    }
  ]

  const items = users.map((user) => ({
    key: user.id,
    name: user.name,
    count: user.blogs.length
  }))

  return (
    <div style={{ width: 290 }}>
      <Text variant="xLarge">Users</Text>
      <DetailsList
        styles={{ root: { width: 290 } }}
        items={items}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
    </div>
  )
}

export default UsersPage
