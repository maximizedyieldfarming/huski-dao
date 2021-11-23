import React from 'react'
import { ToastContainer } from 'husky-uikit1.0'
import useToast from 'hooks/useToast'

const ToastListener = () => {
  const { toasts, remove } = useToast()

  const handleRemove = (id: string) => remove(id)

  // return <ToastContainer toasts={toasts} onRemove={handleRemove} />
  return <div />
}

export default ToastListener
