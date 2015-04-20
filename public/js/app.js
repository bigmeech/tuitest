angular.module('UserManager', ['ui.bootstrap', 'toastr'])

    .value('UserServiceEndpoint', 'http://localhost:3000/api/users')
    .service('UserService', function ($http, UserServiceEndpoint) {
        function fetchUser(id) {
            return $http.get(UserServiceEndpoint, {params: {id: id}})
        }

        function fetchUsers() {
            return $http.get(UserServiceEndpoint)
        }

        function addNewUser(data) {
            return $http.put(UserServiceEndpoint, data);
        }

        function deleteUser(id) {
            return $http.delete(UserServiceEndpoint, {params: {id: id}})
        }

        function updateUser(user) {
            return $http.post(UserServiceEndpoint, user)
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

        var clearForm = function () {
            model.user = {};
        };

        model.fetchUser = function () {
            UserService.fetchUser(model.user._id)
        };

        model.deleteUser = function (id) {
            UserService.fetchUser(id)
                .success(function (result) {
                    toastr.success('User Deleted', 'Success');
                    model.fetchUsers();
                })
                .error(function (err) {
                    toastr.error(result.message, 'An Error Occured');
                });
        };

        model.addUser = function () {
            return UserService.createUser(model.user)
                .success(function (data) {
                    clearForm();
                    toastr.success('New User Created!', 'Success');
                    model.fetchUsers();
                }).error(function (result) {
                    toastr.error(result.message, 'An Error Occured');
                })
        };

        model.saveEdit = function () {
            return UserService.updateUser(model.user)
                .success(function (result) {
                    toastr.success('Details Updated', 'Success');
                    clearForm();
                    model.editMode = false;
                    model.fetchUsers();
                })
                .error(function (result) {
                    toastr.error(result.message, 'An Error Occured');
                })
        };

        model.prepareForEdit = function (user) {
            model.user = user;
            model.editMode = true;
        };

        model.removeUser = function (id) {
            return UserService.removeUser(id)
                .success(function (result) {
                    toastr.success('User Deleted', 'Success')
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
