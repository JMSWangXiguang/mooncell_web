/*
 * @Author: imali
 * @Date: 2022-07-21 15:56:18
 * @LastEditTime: 2022-07-21 16:25:39
 * @LastEditors: imali
 * @Description:
 */
import { Random } from 'mockjs'

export default [
  {
    url: '/strategy/v1/mapping/processed/list',
    method: 'post',
    response: ({ body }) => ({
      status: 200,
      result: {
        pending: Random.range(body.size).map((i) => ({
          id: (body.page - 1) * body.size + i,
          topic: Random.ctitle(2, 4),
          word: Random.ctitle(2, 6),
        })),
        total: 300,
      },
      msg: 'ok',
    }),
  },
]
