<!--
 * @Descripttion:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-25 13:47:31
 * @LastEditors: 周子尧
 * @LastEditTime: 2021-01-20 19:09:15
-->
<script>
export default {
  name: "AuthRedirect",
  created() {
    this.$store
      .dispatch("user/login", {
        organ_id: this.$route.query.organ_id,
        user_code: this.$route.query.user_code,
      })
      .then(() => {
        this.$router.push({
          path: this.$route.query.redirect || "/",
        });
      })
      .catch(() => {
        this.$router.push({
          path: this.$route.query.redirect || "/",
        });
      });
  },
  render() {
    return "";
  },
};
</script>
