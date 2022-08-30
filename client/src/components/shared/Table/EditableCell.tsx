import { Form } from 'antd'

import { EditableCellProps } from '@interfaces/table'

const EditableCell: React.FC<EditableCellProps> = ({
  inputNode,
  editing,
  dataIndex,
  children,
  rest,
  formItem,
}): JSX.Element => {
  return (
    <td {...rest}>
      {editing ? (
        <Form.Item {...formItem} name={dataIndex}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

export default EditableCell
