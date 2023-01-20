import React from 'react'
import Dashboard from '../../components/Dashboard'
import QuickNote from '../../components/quicknotes/QuickNote'

export default function QuickNotes() {
  return (
    <Dashboard className="v-gap">
        <h1>Quick Notes</h1>
        <div className="wrap">
          <QuickNote path='quicknotes/' id='123' />
        </div>
    </Dashboard>
  )
}
