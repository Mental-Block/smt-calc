import React from 'react'
import { Modal, Form } from 'antd'

import useGenerateId from '@util/useGenerateId'
import { FormModalProps } from '@interfaces/form'

const FormModal: React.FC<FormModalProps> = ({
  visible,
  onOk,
  onCancel,
  formItems,
  ...props
}): JSX.Element => {
  const [form] = Form.useForm(props.form)
  const generateId = useGenerateId()

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values)
        form.resetFields()
        onCancel()
      })
      .catch((info) => {
        console.error('Validate Failed:', info)
      })
  }

  return (
    <React.Fragment>
      <Modal
        visible={visible}
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={onFinish}
      >
        <Form
          form={form}
          preserve={false}
          scrollToFirstError={true}
          layout="vertical"
          name={generateId('formModal')}
        >
          {formItems.map((item, id) => (
            <Form.Item key={id} {...item} />
          ))}
        </Form>
      </Modal>
    </React.Fragment>
  )
}

export default FormModal
