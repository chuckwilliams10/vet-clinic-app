(function() {
	var vetApp = angular.module('vetApp', ['ngResource', 'ngRoute']);
	
	vetApp.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/allTables/', {
				templateUrl: '../templates/allTables.html',
				controller: 'MainController'
			})
			.when('/animals/', {
				templateUrl: '../templates/pet/pets-template.html',
				controller: 'AnimalCtrl'
			})
			.when('/doctors/', {
				templateUrl: '../templates/doctor/doctors-template.html',
				controller: 'DoctorCtrl'
			})
			.when('/owners/', {
				templateUrl: '../templates/owner/owners-template.html',
				controller: 'OwnerCtrl'
			})
			.when('/visits/', {
				templateUrl: '../templates/visit/visits-template.html',
				controller: 'VisitCtrl'
			})
			.when('/currentAnimal/', {
				templateUrl: '../templates/pet/current-animal.html',
				controller: 'AnimalCtrl'
			})
			.when('/currentDoctor/', {
				templateUrl: '../templates/doctor/current-doctor.html',
				controller: 'DoctorCtrl'
			})
			.when('/currentOwner/', {
				templateUrl: '../templates/owner/current-owner.html',
				controller: 'OwnerCtrl'
			})
			.when('/currentVisit/', {
				templateUrl: '../templates/visit/current-visit.html',
				controller: 'VisitCtrl'
			})
			.when('/currentCheckedTables/', {
				templateUrl: '../templates/current-checked-tables.html',
				controller: 'VisitCtrl'
			})
			.otherwise({
				redirectTo: '/allTables/'
			});
			
		$locationProvider.html5Mode({ enabled: true, requireBase: false });
	});
	
	vetApp.directive('listPets', function() {
		return {
			templateUrl: '../templates/pet/list-pets.html'
		}
	});
	
	vetApp.directive('listDoctors', function() {
		return {
			templateUrl: '../templates/doctor/list-doctors.html'
		}
	});
	
	vetApp.directive('listOwners', function() {
		return {
			templateUrl: '../templates/owner/list-owners.html'
		}
	});
	
	vetApp.directive('listVisits', function() {
		return {
			templateUrl: '../templates/visit/list-visits.html'
		}
	});
	
	vetApp.controller('MainController', ['$scope', '$rootScope', function($scope, $rootScope) {
		$rootScope.isCheck;
		$rootScope.ownerName = [];
		$rootScope.doctorName = [];
		$rootScope.petName = [];
		$rootScope.visitDate = [];
			
		$scope.check = function() {
			if($rootScope.isCheck) {
				$rootScope.isCheck = false;
			} else {
				$rootScope.isCheck = true;
			}
		};				
	}]);
	
	vetApp.controller('AnimalCtrl', ['$scope', '$resource', '$location', '$rootScope', '$http', function($scope, $resource, $location, $rootScope, $http) {
		var pets;
	
		$scope.animals = [];
		$rootScope.currentAnimal;
		
		pets = $http.get('/animals'); 
		pets.then(function(response) {
			$scope.animals = response.data;
		});

		$scope.viewAnimal = function($index) {
			$rootScope.currentAnimal = $scope.animals[$index];
			if($rootScope.isCheck) {
				$rootScope.$broadcast('searchIdByPet');       
				$location.path('/currentCheckedTables/');
			} else {
				$location.path('/currentAnimal/');		
			}
		};
		
		$scope.$on('searchNameById',function(event){
			angular.forEach($scope.animals, function(value){
				if($rootScope.currentValue.petId === value._id) {
					$rootScope.petName.push(value.name);
				}
			});
		});
	}]);
	
	vetApp.controller('DoctorCtrl', ['$scope', '$resource', '$location', '$rootScope', '$http', function($scope, $resource, $location, $rootScope, $http) {
		var doctors;
		
		$scope.doctors = [];
		$rootScope.currentDoctor;
		
		doctors = $http.get('/doctors'); 
		doctors.then(function(response) {
			$scope.doctors = response.data;
		});
				
		$scope.viewDoctor = function($index) {
			$rootScope.currentDoctor = $scope.doctors[$index];
			if($rootScope.isCheck) {        
				$rootScope.$broadcast('searchIdByDoctor');       
				$location.path('/currentCheckedTables/');
			} else {
				$location.path('/currentDoctor/');
			}		
		}
		
		$scope.$on('searchNameById',function(event){
			angular.forEach($scope.doctors, function(value){
				if($rootScope.currentValue.doctorId === value._id) {
					$rootScope.doctorName.push(value.name);
				}
			});
		});
	}]);
	
	vetApp.controller('OwnerCtrl', ['$scope', '$resource', '$location', '$rootScope', '$http', function($scope, $resource, $location, $rootScope, $http) {
		var owners;
		
		$scope.owners = [];
		$rootScope.currentOwner;
		
		owners = $http.get('/owners'); 
		owners.then(function(response) {
			$scope.owners = response.data;
		});
				
		$scope.viewOwner = function($index) {
			$rootScope.currentOwner = $scope.owners[$index];
			if($rootScope.isCheck) {       
				$rootScope.$broadcast('searchIdByOwner');
				$location.path('/currentCheckedTables/');
			} else {			
				$location.path('/currentOwner/');
			}	
		}	
		
		$scope.$on('searchNameById',function(event){      
			angular.forEach($scope.owners, function(value){
				if($rootScope.currentValue.ownerId === value._id) { 
					$rootScope.ownerName.push(value.name);
					$rootScope.visitDate.push($rootScope.currentValue.visitedAt);
				}
			});
		});
	}]);
	
	vetApp.controller('VisitCtrl', ['$scope', '$resource', '$location', '$rootScope', '$http', function($scope, $resource, $location, $rootScope, $http) {
		var visits;
		
		$scope.visits = [];
		$rootScope.currentValue;
		
		visits = $http.get('/visits'); 
		visits.then(function(response) {
			$scope.visits = response.data;
		});
		
		$scope.viewVisit = function($index) {
			$rootScope.currentValue = $scope.visits[$index];
			if($rootScope.isCheck) { 
				$rootScope.$broadcast('searchNameById');      
				$location.path('/currentCheckedTables/');
			} else {
				$location.path('/currentVisit/');
			}
		} 

		$scope.$on('searchIdByOwner',function(event){
			angular.forEach($scope.visits, function(value){
				if($rootScope.currentOwner._id === value.ownerId) { 
					$rootScope.currentValue = value;  
					$rootScope.$broadcast('searchNameById');
				}
			});
		});
		
		$scope.$on('searchIdByDoctor',function(event){
			angular.forEach($scope.visits, function(value){
				if($rootScope.currentDoctor._id === value.doctorId) {
					$rootScope.currentValue = value;
					$rootScope.$broadcast('searchNameById');
				}
			});
		});
		
		$scope.$on('searchIdByPet',function(event){
			angular.forEach($scope.visits, function(value){
				if($rootScope.currentAnimal._id === value.petId) { 
					$rootScope.currentValue = value;
					$rootScope.$broadcast('searchNameById');
				}
			});
		});
	}]);
})();