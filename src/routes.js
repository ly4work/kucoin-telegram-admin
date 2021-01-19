import Login from "./pages/basic/Login"
import Configs from "./pages/basic/Configs"
import DefaultRule from "./pages/reward/DefaultRule"
import Rules from "./pages/reward/Rules";
import RewardUsers from "./pages/reward/RewardUsers";
import UserHitLogs from "./pages/reward/UserHitLogs";
import Questions from "./pages/bots/Questions";
import Cards from "./pages/bots/Cards";
import Courses from "./pages/bots/Courses";
import Theme from "./pages/bots/Theme";
import BotEntry from "./pages/bots/BotEntry";
import Score from "./pages/bots/Score";
import LoginV2 from "./pages/bots/LoginV2";
import Welcome from "./pages/bots/Welcome";
import HomeLang from "./pages/bots/HomeLang";
import BindUser from "./pages/bots/BindUser";
import BindSuc from "./pages/bots/BindSuc";

export default {
    '/mybot/': BotEntry,
    '/mybot/page/reward/default-rule/detail': DefaultRule,
    '/mybot/page/reward/rule/list': Rules,
    '/mybot/page/reward/user/list': RewardUsers,
    '/mybot/page/reward/hit-log/list': UserHitLogs,
    '/mybot/page/basic/login': Login,
    '/mybot/page/basic/config/list': Configs,
    '/mybot/page/bots/botentry/list': BotEntry,
    '/mybot/page/bots/theme/list': Theme,
    '/mybot/page/bots/course/list': Courses,
    '/mybot/page/bots/card/list': Cards,
    '/mybot/page/bots/question/list': Questions,
    '/mybot/page/bots/score/list': Score,
    '/mybot/page/bots/login/v2': LoginV2,
    '/mybot/page/bots/welcome/list': Welcome,
    '/mybot/page/bots/homelang/list': HomeLang,
    '/mybot/page/bots/binduser/list': BindUser,
    '/mybot/page/bots/bindsuc/list': BindSuc,
}
