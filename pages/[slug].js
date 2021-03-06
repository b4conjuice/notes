import { useState } from 'react'
// import Link from 'next/link'
// import { Home, List as ListIcon, Check, ArrowLeftCircle } from 'react-feather'

import Page from '../components/Page'
import List from '../components/List'
import Todo from '../components/Todo'
import Markdown from '../components/styles/Markdown'
// import Footer from '../components/styles/Footer'
import { updateNote, searchNotes } from '../lib/api'

export default () => {
  const slug =
    typeof window !== 'undefined' ? window.location.pathname.slice(1) : ''
  const [editOrder] = useState(false)
  const { data } = searchNotes({ slug })
  const notes = data || {}
  if (!data)
    return (
      <Page>
        <main>loading</main>
      </Page>
    )
  const [note] = notes
  const { markdown, list, table } = note
  const editNote = async updates => updateNote({ _id: note._id, ...updates })
  const title = `${
    markdown
      ? note.title.replace('# ', '')
      : list
        ? note.title.replace('= ', '')
        : note.title
  }`
  return (
    <Page title={title}>
      <main>
        <div className="content">
          {markdown ? (
            <Markdown dangerouslySetInnerHTML={{ __html: markdown }} />
          ) : note.title.includes('[ ') ? (
            <>
              <h1>{note.title.replace('[ ', '')}</h1>
              <Todo list={table} editNote={editNote} />
            </>
          ) : list && list.length > 0 ? (
            <>
              <h1>{note.title.replace('= ', '')}</h1>
              <List list={list} editOrder={editOrder} />
            </>
          ) : (
            <>
              <h1>{note.title}</h1>
              <pre>{note.body}</pre>
            </>
          )}
        </div>
        {/* <Footer>
        <ul>
          {!note.title.includes('[ ') && (
            <>
              <li>
                <Link href="/admin">
                  <a>
                    <ArrowLeftCircle />
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a>
                    <Home />
                  </a>
                </Link>
              </li>
              {list &&
                list.length > 0 && (
                  <li>
                    <button type="button" onClick={() => setEditOrder(!editOrder)}>
                      {editOrder ? <Check /> : <ListIcon />}
                    </button>
                  </li>
                )}
            </>
          )} */}
        {/* {note.title.includes('[ ') && (
            <li>
              <button type="button" onClick={() => setEditOrder(!editOrder)}>
                +
              </button>
            </li>
          )} */}
        {/* </ul>
      </Footer> */}
      </main>
    </Page>
  )
}
