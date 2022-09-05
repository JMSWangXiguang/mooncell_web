/*
 * @Author: imali
 * @Date: 2022-03-30 10:04:03
 * @LastEditTime: 2022-04-06 14:31:36
 * @LastEditors: imali
 * @Description:
 */
import { Random } from 'mockjs'

export default [
  {
    url: '/strategy/v1/common/dept/list',
    method: 'post',
    response: {
      status: 200,
      result: {
        departschema: [
          {
            name: '精神科',
          },
          {
            name: '德国骨科',
          },
        ],
      },
      msg: 'ok',
    },
  },
  {
    url: '/strategy/v1/common/model/list',
    method: 'post',
    response: ({ body }) => ({
      status: 200,
      result: {
        total: 270,
        model_list: Random.range(body.size).map(() => ({
          model_id: Random.string('number', 6, 6),
          name: Random.ctitle(3, 10),
          desc: Random.cparagraph(3, 300),
          status: 'normal',
          update_time: Random.date('yyyy-MM-dd HH:mm:ss'),
          consuming: '12h 23m',
          rate: Random.float(0, 1),
        })),
      },
      msg: 'ok',
    }),
  },
  {
    url: '/strategy/v1/common/model/info',
    method: 'post',
    response: {
      status: 200,
      result: {
        model_id: '002',
        model_name: 'MO模型',
        sample_config: {
          category: ['chief', 'hpi', 'gue'],
          source: ['全部'],
          marker: ['007', '0001', '0020'],
          dept: ['002', '023', '122'],
        },
        model_config: {
          参数1: '123',
          参数2: 'true',
          参数3: 'base',
        },
        last_time: '2020-11-03 20:10:10',
        update_userid: '0001',
        update_user_name: '路人甲',
        status: 'normal',
        desc: 'XXXXXXXXJKKKKKEE',
      },
      msg: 'ok',
    },
  },
  {
    url: '/strategy/v1/common/model/sample',
    method: 'post',
    response: {
      status: 200,
      result: {
        sample_num: 4231,
      },
      msg: 'ok',
    },
  },
  {
    url: '/strategy/v1/common/mould/argument',
    method: 'post',
    response: {
      status: 200,
      result: {
        model_config: {
          参数1: '123',
          参数2: 'true',
          参数3: 'base',
        },
      },
      msg: 'ok',
    },
  },
  {
    url: '/strategy/v1/common/model/train',
    method: 'post',
    response: {
      status: 200,
      result: {},
      msg: 'ok',
    },
  },
  {
    url: '/strategy/v1/common/model/cancel',
    method: 'post',
    response: {
      status: 200,
      result: {},
      msg: 'ok',
    },
  },
  {
    url: '/strategy/v1/common/mould/schema',
    method: 'post',
    response: {
      status: 200,
      result: [
        {
          mould_id: 's0001',
          name: 'xxxx模型',
        },
        {
          mould_id: 's0002',
          name: 'xxxx模型',
        },
      ],
      msg: 'ok',
    },
  },
  {
    url: '/strategy/v1/common/model/create',
    method: 'post',
    response: {
      status: 200,
      result: {},
      msg: 'ok',
    },
  },
  {
    url: '/strategy/v1/common/model/update',
    method: 'post',
    response: {
      status: 200,
      result: {},
      msg: 'ok',
    },
  },
]
