import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Edit,
  Copy,
  ArrowRightCircle,
  List,
  CheckSquare,
  Hash,
} from 'react-feather'
import { toast } from 'react-toastify'

import Delete from './Delete'
import NoteList from './styles/NoteList'
import { deleteNote, updateNote } from '../lib/api'

const AuthorField = ({ author: initialAuthor, id, revalidate }) => {
  const [author, setAuthor] = useState(initialAuthor || '')
  return (
    <div className='author'>
      <input
        type='text'
        value={author}
        onChange={e => setAuthor(e.target.value)}
      />
      <button
        disabled={(!initialAuthor && author === '') || initialAuthor === author}
        type='button'
        onClick={async () => {
          await updateNote({
            _id: id,
            author,
          })
          await revalidate()
          toast.success('author updated')
        }}
      >
        update
      </button>
    </div>
  )
}

const Tags = ({ tags }) => (
  <ul className='tags'>
    {tags.map(tag => (
      <li key={tag}>{tag}</li>
    ))}
  </ul>
)

export default ({ notes, revalidate }) => {
  const router = useRouter()
  const { pathname } = router
  return (
    <NoteList>
      {notes.map(({ _id, title, tags, slug, list, markdown }) => (
        <li key={_id}>
          <h2 data-id={_id}>{title}</h2>
          {tags && <Tags tags={tags} />}
          <div className='commands'>
            <Link href={`${pathname}?id=${_id}`} as={`${pathname}/${_id}`}>
              <Edit />
            </Link>
            {list && (
              <Link href={`/lists/${_id}`}>
                <List />
              </Link>
            )}
            {title.startsWith('[ ') && (
              <Link href={`/checklists/${_id}`}>
                <CheckSquare />
              </Link>
            )}
            {markdown && (
              <Link href={`/md/${_id}`}>
                <Hash />
              </Link>
            )}
            <Link href={`${pathname}?copy=${_id}`} as={pathname}>
              <Copy />
            </Link>
            {slug && (
              <Link href={`/${slug}`}>
                <ArrowRightCircle />
              </Link>
            )}
            <Delete
              handleDelete={async () => {
                await deleteNote(_id)
                await revalidate()
                toast.success('note deleted')
              }}
            />
          </div>
        </li>
      ))}
    </NoteList>
  )
}
