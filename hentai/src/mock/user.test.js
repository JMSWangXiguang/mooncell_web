/*
 * @Author: imali
 * @Date: 2022-04-06 14:07:40
 * @LastEditTime: 2022-04-06 14:07:40
 * @LastEditors: imali
 * @Description:
 */

export default [
  {
    url: '/strategy/v1/common/user/list',
    method: 'post',
    response: {
      status: 200,
      result: {
        total: 15,
        user_list: [
          {
            userid: '18214',
            name: 'XXX',
            account: 'YYYYYYYYYYYYY',
            groups: [
              {
                group_id: 'd1',
                group_name: '标注',
                style: '#CCEE00',
              },
              {
                group_id: 'c55',
                group_name: '标注管理',
                style: '#CCEE00',
              },
            ],
          },
          {
            userid: '5412',
            name: 'XXX',
            account: 'YYYYYYYYYYYYY',
            groups: [
              {
                group_id: 'd1',
                group_name: '标注',
                style: '#CCEE00',
              },
            ],
          },
        ],
      },
      msg: 'ok',
    },
  },
]
