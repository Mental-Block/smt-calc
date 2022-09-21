import qs from 'qs'
import { API } from '@const'
import useAuthContext from '@context/AuthContext'
import { fetchJson } from '@util/useFetch'

import type { TableQuery } from '@interfaces/table'
import type { FilterValue } from 'antd/lib/table/interface'
import type { ComponentNameProps, ComponentProps } from '@interfaces/component'
import type { LoginProps, UserDataProps, UserProps } from '@interfaces/user'
import type { Fetch } from '@interfaces/fetch'
import type { LabelProps } from '@interfaces/label'
import type { Floorlife } from '@interfaces/msl'

interface PublicApi {
  userRefreshToken: () => Fetch
  userLogin: (values: LoginProps) => Fetch
  userLogout: () => Fetch
}

interface PrivateApi {
  componentAll: (params: TableQuery<ComponentProps>) => Fetch
  componentSave: (row: ComponentProps) => Fetch
  componentAdd: (values: Omit<ComponentProps, 'id'>) => Fetch
  componentDel: (id: Pick<ComponentProps, 'id'>['id']) => Fetch
  componentNameAll: (name: ComponentNameProps['name']) => Fetch
  componentNameAdd: (value: string) => Fetch
  componentNameDel: (id: number) => Fetch
  internalPartNumConflict: (
    partNumberInternal: Pick<
      ComponentProps,
      'partnumberInternal'
    >['partnumberInternal']
  ) => Fetch
  labelAll: (params: TableQuery<LabelProps>) => Fetch
  labelAdd: (values: LabelProps) => Fetch
  labelDel: (id: Pick<LabelProps, 'id'>['id']) => Fetch
  userAll: (params: TableQuery<UserDataProps>) => Fetch
  userSave: (row: UserDataProps) => Fetch
  userAdd: (values: UserProps) => Fetch
  userDel: (id: Pick<UserDataProps, 'id'>) => Fetch
  floorlifeAll: (params: TableQuery<Floorlife>) => Fetch
  floorlifeAdd: (partId: Pick<LabelProps, 'partId'>['partId']) => Fetch
  floorlifeDel: (id: Pick<LabelProps, 'partId'>['partId']) => Fetch
  floorlifeunPause: (partId: Pick<LabelProps, 'partId'>['partId']) => Fetch
  floorlifePause: (partId: Pick<LabelProps, 'partId'>['partId']) => Fetch
  // userIsUser: (id: number, value: Pick<UserDataProps, 'username'>) => Fetch
}

function tableQuery(params: any) {
  const query = {
    pageSize: params.pagination?.pageSize,
    page: params.pagination?.current,
    sortField: Array.isArray(params.sorter)
      ? params.sorter?.[0].field
      : params.sorter?.field,
    sortOrder: Array.isArray(params.sorter)
      ? params.sorter?.[0].order
      : params.sorter?.order,
  }

  if (params.filters) {
    return {
      ...query,
      ...filtersIntoQueryString<any>(params.filters),
    }
  }

  return query
}

function filtersIntoQueryString<T>(
  filters: Record<keyof T, FilterValue | null>
) {
  const newFilter = { ...filters }

  Object.values(filters).map((value, i) => {
    if (Array.isArray(value) && value.length > 1) {
      ;(newFilter[Object.keys(newFilter)[i] as keyof T] as any) =
        value?.join(' ')
    }

    return value
  })

  return newFilter
}

function fetchAPI<O>(api: Record<keyof O, (args?: any) => Fetch>) {
  return async function <T>(
    key: keyof O,
    args?: Parameters<typeof api[keyof O]>[0]
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      return api[key](args).map(
        async ({ url, options }) =>
          await fetchJson<T>(url, options)
            .then((data) => {
              resolve(data)
            })
            .catch((error) => {
              reject(error)
            })
      )
    })
  }
}

export const usePublicApi = () => {
  const api: PublicApi = {
    userRefreshToken: () => [
      {
        url: `${API.USER}/refreshtoken`,
        options: {
          method: 'POST',
          credentials: 'include',
        },
      },
    ],
    userLogin: (values) => [
      {
        url: `${API.USER}/login`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify(values),
        },
      },
    ],
    userLogout: () => [
      {
        url: `${API.USER}/logout`,
        options: {
          credentials: 'include',
        },
      },
    ],
  }
  return fetchAPI<PublicApi>(api)
}

export const usePrivateApi = () => {
  const { auth } = useAuthContext()
  const api: PrivateApi = {
    userAll: (params) => [
      {
        url: `${API.USER}?${qs.stringify(tableQuery(params))}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'GET',
        },
      },
    ],
    userSave: (row) => [
      {
        url: `${API.USER}/${row.id}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'PATCH',
          body: JSON.stringify(row),
        },
      },
    ],
    userAdd: (values) => [
      {
        url: `${API.USER}/register`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify(values),
        },
      },
    ],
    userDel: (id) => [
      {
        url: `${API.USER}/${id}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'DELETE',
        },
      },
    ],
    componentAll: (params) => [
      {
        url: `${API.COMPONENT}?${qs.stringify(tableQuery(params))}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'GET',
        },
      },
    ],
    componentSave: (row) => [
      {
        url: `${API.COMPONENT}/${row.id}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'PATCH',
          body: JSON.stringify(row),
        },
      },
    ],
    componentAdd: (values) => [
      {
        url: `${API.COMPONENT}/add`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify(values),
        },
      },
    ],
    componentDel: (id) => [
      {
        url: `${API.COMPONENT}/${id}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'DELETE',
        },
      },
    ],
    componentNameAll: (name) => [
      {
        url: `${API.COMPONENT_NAME}/` + `?${qs.stringify({ name })}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'GET',
        },
      },
    ],
    componentNameAdd: (value) => [
      {
        url: `${API.COMPONENT_NAME}/add`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify({ name: value }),
        },
      },
    ],
    componentNameDel: (id) => [
      {
        url: `${API.COMPONENT_NAME}/${id}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'DELETE',
        },
      },
    ],
    internalPartNumConflict: (partNumberInternal: string) => [
      {
        url: `${API.COMPONENT}/${partNumberInternal}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'POST',
        },
      },
    ],
    labelAll: (params) => [
      {
        url: `${API.LABEL}?${qs.stringify(tableQuery(params))}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'GET',
        },
      },
    ],
    labelAdd: (values) => [
      {
        url: `${API.LABEL}/add`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify(values),
        },
      },
    ],
    labelDel: (id) => [
      {
        url: `${API.LABEL}/${id}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'DELETE',
        },
      },
    ],
    floorlifeAll: (params) => [
      {
        url: `${API.FLOORLIFE}?${qs.stringify(tableQuery(params))}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'GET',
        },
      },
    ],
    floorlifeAdd: (partId) => [
      {
        url: `${API.FLOORLIFE}/${partId}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'POST',
        },
      },
    ],
    floorlifeDel: (partId) => [
      {
        url: `${API.FLOORLIFE}/${partId}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'DELETE',
        },
      },
    ],
    floorlifeunPause: (partId) => [
      {
        url: `${API.FLOORLIFE}/unpause/${partId}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'POST',
        },
      },
    ],
    floorlifePause: (partId) => [
      {
        url: `${API.FLOORLIFE}/pause/${partId}`,
        options: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `bearer ${auth.accessToken}`,
          },
          credentials: 'include',
          method: 'POST',
        },
      },
    ],
  }

  return fetchAPI<PrivateApi>(api)
}
