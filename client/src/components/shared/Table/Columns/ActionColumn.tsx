import React from 'react'

import { Space, Popconfirm, Typography } from 'antd'

import { ActionColumnProps } from '@interfaces/table'
import {
  DeleteFilled,
  EditFilled,
  PauseCircleFilled,
  PlayCircleFilled,
} from '@ant-design/icons'

const ActionColumn: React.FC<ActionColumnProps> = ({ edit, del, pause }) => {
  if (edit && edit?.showIcon === undefined) edit.showIcon = true
  if (del && del?.showIcon === undefined) del.showIcon = true
  if (pause && pause?.showIcon === undefined) pause.showIcon = true

  return (
    <React.Fragment>
      <div className="flex-center-center">
        {edit?.editable ? (
          <Space>
            <Popconfirm
              onConfirm={edit?.action.save}
              title={
                edit?.message?.save ? edit?.message?.save : 'Save changes?'
              }
              okText="Yes"
              cancelText="No"
              placement="left"
            >
              <Typography.Link>Save</Typography.Link>
            </Popconfirm>

            <Popconfirm
              onConfirm={edit?.action.cancel}
              title={
                edit?.message?.cancel
                  ? edit?.message?.cancel
                  : 'Cancel changes?'
              }
              okText="Yes"
              cancelText="No"
              placement="left"
            >
              <Typography.Link>Cancel</Typography.Link>
            </Popconfirm>
          </Space>
        ) : (
          <Space size="middle">
            {del?.showIcon && (
              <Popconfirm
                onConfirm={del.del}
                title={del?.message ? del?.message : 'Delete?'}
                okText="Yes"
                cancelText="No"
                placement="left"
              >
                <Typography.Link>
                  <DeleteFilled />
                </Typography.Link>
              </Popconfirm>
            )}

            {pause?.showIcon === true && (
              <>
                {pause.isPaused ? (
                  <Popconfirm
                    title={
                      pause?.message?.unpause
                        ? pause?.message.unpause
                        : 'Pause?'
                    }
                    onConfirm={pause?.action.unPause}
                    okText="Yes"
                    cancelText="No"
                    placement="left"
                  >
                    <Typography.Link>
                      <PlayCircleFilled />
                    </Typography.Link>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title={
                      pause?.message?.pause ? pause?.message.pause : 'Play?'
                    }
                    onConfirm={pause?.action.pause}
                    okText="Yes"
                    cancelText="No"
                    placement="left"
                  >
                    <Typography.Link>
                      <PauseCircleFilled />
                    </Typography.Link>
                  </Popconfirm>
                )}
              </>
            )}

            {edit?.showIcon && (
              <Typography.Link
                disabled={edit.disable}
                onClick={edit?.action.edit}
              >
                <EditFilled />
              </Typography.Link>
            )}
          </Space>
        )}
      </div>
    </React.Fragment>
  )
}

export default ActionColumn
