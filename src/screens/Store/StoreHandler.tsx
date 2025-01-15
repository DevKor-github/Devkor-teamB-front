import {PointEventHandler} from '../../Events';
import {
  fetchCheckPermission,
  fetchGetPoints,
  fetchUsePoints,
} from '@src/data/storeApi';
import {fetchUserInfo} from '@src/data/studentApi';

export class PermissionType {
  static readonly NONE = new PermissionType('0', 0);
  static readonly DAY = new PermissionType('1', 80);
  static readonly WEEK = new PermissionType('7', 160);
  static readonly FORTNIGHT = new PermissionType('14', 240);
  static readonly MONTH = new PermissionType('30', 300);

  private constructor(
    public readonly days: string,
    public readonly cost: number,
  ) {}

  get numeric(): number {
    return parseInt(this.days, 10);
  }

  static fromString(days: string): PermissionType {
    switch (days) {
      case '1':
        return PermissionType.DAY;
      case '7':
        return PermissionType.WEEK;
      case '14':
        return PermissionType.FORTNIGHT;
      case '30':
        return PermissionType.MONTH;
      default:
        return PermissionType.NONE;
    }
  }
}

export class RewardType {
  static readonly ANSWER = new RewardType('answer', 5);
  static readonly CHOSEN = new RewardType('chosen', 20);
  static readonly SURVEY = new RewardType('survey', 10);

  private constructor(
    public readonly type: string,
    public readonly point: number,
  ) {}
}

const consumePoints = async (pass_type: PermissionType) => {
  try {
    const isSuccess = await fetchUsePoints(pass_type);
    if (isSuccess) {
      PointEventHandler.emit('POINTS_UPDATED', -pass_type.cost);
    }
    return isSuccess;
  } catch (e) {
    return false;
  }
};

const earnPoints = async (rewardType: RewardType) => {
  try {
    const isSuccess = await fetchGetPoints(rewardType.type);
    if (isSuccess) {
      PointEventHandler.emit('POINTS_UPDATED', rewardType.point);
    }
    return isSuccess;
  } catch (e) {
    return false;
  }
};

const getPermissionExpireDate = async () => {
  const {data} = await fetchUserInfo();
  const expireDate = new Date(data.permission_date);
  const permissionType = PermissionType.fromString(data.permission_type);
  expireDate.setDate(expireDate.getDate() + permissionType.numeric);
  return expireDate;
};

const getPermissionRemainder = async () => {
  const expireDate = await getPermissionExpireDate();
  const today = new Date();
  const remainder = Math.floor(
    (expireDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  return remainder;
};

const getPermissionType = async () => {
  const hasPermission = await fetchCheckPermission();
  if (hasPermission) {
    const {data} = await fetchUserInfo();
    return PermissionType.fromString(data.permission_type);
  } else {
    return PermissionType.NONE;
  }
};

export {consumePoints, earnPoints, getPermissionRemainder, getPermissionType};
