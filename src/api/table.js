import request from '@/utils/as400Req'

export function getCobranzas(params) {
  return request({
    url: '/WSCOBDIAP',
    method: 'get',
    params
  })
}
