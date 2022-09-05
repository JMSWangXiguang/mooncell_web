<!--
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-25 13:47:31
 * @LastEditors: imali
 * @LastEditTime: 2022-03-25 14:18:55
-->
<script>
export default {
  name: 'AuthRedirect',
  created() {
    this.$store
      .dispatch('user/authLogin', {
        organ_id: this.$route.query.organ_id,
        user_code: this.$route.query.user_code,
      })
      .then(() => {
        this.$router.replace({
          path: this.$route.query.redirect || '/',
        })
      })
      .catch(() => {
        this.$router.replace({
          path: this.$route.query.redirect || '/',
        })
      })
  },
  render() {
    return ''
  },
}
</script>
