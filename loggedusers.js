/*jshint esversion: 6 */

class LoggedUsers {
	constructor() {
        this.users = new Map();
    }

    userInfoByID(userID) {
    	return this.users.get(userID);
    }

    userInfoBySocketID(socketID) {
        for (var [userID, userInfo] of this.users) {
            if (userInfo.socketID == socketID)  {
                return userInfo;                
            }
        }
        return null;
    }

    addUserInfo(user, socketID) {
        let userInfo = {user: user, socketID: socketID};
    	this.users.set(user.id, userInfo);
    	return userInfo;
    }

    removeUserInfoByID(userID) {
        let userInfo = this.userInfoByID(userID);
        if (userInfo === null) {
            return null;
        }
        let cloneUserInfo = Object.assign({}, userInfo);
        this.users.delete(userID);
        return cloneUserInfo;
    }

    removeUserInfoBySocketID(socketID) {
        let userInfo = this.userInfoBySocketID(socketID);
        if (userInfo === null) {
            return null;
        }
        let cloneUserInfo = Object.assign({}, userInfo);
        this.users.delete(userInfo.user.id);
        return cloneUserInfo;
    }

    getUsersInfoOfDepartment(departmentID) {
        let usersInfo= [];
        for (var [userID, userInfo] of this.users) {
            if (userInfo.user.department_id == departmentID)  {
                usersInfo.push(userInfo);   
            }
        }
        return usersInfo;
    }
}

module.exports = LoggedUsers;
