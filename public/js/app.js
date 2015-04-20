angular.module('UserManager', ['ui.bootstrap','toastr'])

    .value('UserServiceEndpoint', 'http://localhost:3000/api/users')
    .service('UserService', function ($http, UserServiceEndpoint) {
        function fetchUser(params) {
            return $http.get(UserServiceEndpoint, params)
        }

        function fetchUsers() {
            return $http.get(UserServiceEndpoint)
        }

        function addNewUser(data) {
            return $http.post(UserServiceEndpoint, data);
        }

        function deleteUser(id) {
            return $http.delete(UserServiceEndpoint, {_id: id})
        }

        function updateUser(id) {
            return $http.put(UserServiceEndpoint, {_id: id})
        }

        return {
            createUser: addNewUser,
            fetchUser: fetchUser,
            fetchAllUsers: fetchUsers,
            updateUser: updateUser,
            removeUser: deleteUser
        }
    })
    .controller('MainController', function (UserService, $scope, $q, toastr) {
        var model = {};
        model.isCollapsed = false;
        model.showForm = function () {
            model.isCollapsed = !model.isCollapsed
        };


        model.fetchUser = function () {
            UserService.fetchUser()
        };

        model.addUser = function () {
            var user = {
                lastname: $scope.lastname,
                firstname: $scope.firstname,
                email: $scope.email,
                bio: $scope.bio
            };
            UserService.create(user)
                .success(function (data) {
                    $scope.firstname = $scope.lastname = $scope.email = $scope.bio = "";
                    toastr.success('New User Created!','Success')
                    model.fetchUsers();
                }).error(function (result) {
                    toastr.error(result.message, 'An Error Occured');
                })
        };

        model.editUser = function (id) {
            return UserService.updateUser(id)
                .success(function (result) {
                    toastr.success('Details Updates','Success')
                    model.fetchUsers();
                })
                .error(function (result) {
                    toastr.error(result.message, 'An Error Occured');
                })
        };

        model.removeUser = function (id) {
            return UserService.removeUser(id)
                .success(function (result) {
                    toastr.success('User Deleted','Success')
                    model.fetchUsers();
                })
                .error(function (result) {
                    toastr.error(result.message, 'An Error Occured');
                })
        };

        model.fetchUsers = function () {
            return UserService.fetchAllUsers()
                .success(function (result) {
                    model.users = result
                })
                .error(function (result) {
                    toastr.error(result.message, 'An Error Occured');
                })
        };

        $scope.vm = model;

        $q.when(model.fetchUsers())
            .then(function (result) {
                model.users = result.data
            })
    });
