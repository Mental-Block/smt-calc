import { FormInstance } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'

export default function useEdit<T extends { id: React.Key }>(
  formInstance: FormInstance<T>
) {
  const [form] = useForm(formInstance)
  const [editingKey, setEditingKey] = React.useState<React.Key>('')

  const isEditing = (key: React.Key): boolean => key == editingKey

  const edit = (record: T, defualtValues = {} as Partial<T>): void => {
    form.setFieldsValue({
      ...record,
      ...defualtValues,
    } as any)

    setEditingKey(record.id)
  }

  const cancelEdit = (): void => {
    setEditingKey('')
  }

  return {
    editingKey,
    cancelEdit,
    edit,
    isEditing,
  }
}
