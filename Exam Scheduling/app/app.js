// Declare the module
var myfacultyApp = angular.module('myfacultyApp', ['ngRoute']);


// Define the controller and inject $http
myfacultyApp.controller('facultyController', ['$scope', '$http', '$timeout',function($scope, $http, $timeout) {
    $scope.selectedDoption='---';
    $scope.$on('$includeContentLoaded', function() {
        $timeout(initializeDragAndDrop, 0);
        //ASSIGNING CLEAR ALL BUTTON
        var clear=document.getElementById('clear_button');
	    clear.addEventListener('click', $scope.clearContent);
        //ASSIGNING CLICKABILITY TO ALL TIME-SLOTS
        const slots = document.querySelectorAll('.time-slot');
        slots.forEach(slot => {
            slot.addEventListener('click', $scope.handleClick);
        });
        
    
        //ASSIGNING REMOVE BUTTON
        $scope.removeButton=document.getElementById('remove_button');
        $scope.removeButton.addEventListener('click', $scope.removeContent);
    });
        //GETTING FACILTY DATA FROM DATABASE
    $http.get('http://localhost:5500/jj/api/faculty-departments').then(function(response) {
        $scope.faculty = response.data;
        // Transform the data into a format suitable for ng-options
        $scope.options = $scope.faculty.map(function(facultyMember) {
            return facultyMember.name; // Assuming 'name' is the property to be used

        });
        //INITIALIZE THE FACULTY DROP-DOWN MENU
        $scope.selectedOption = $scope.options[0];
        //FUNCTION TO UPDATE DEPARTMENTS DROP-DOWN MENU
        $scope.updateDepartments = function() {
            $scope.doptions = []; // Initialize the department options array
            $scope.faculty.forEach(element => {
                if (element.name === $scope.selectedOption) {
                    // Assuming element.department is an array of departments
                    $scope.doptions.push(element.department);
                }
            });
        };

    // INITIALIZE THE UPDATE OF DEPARTMENTS
    $scope.updateDepartments();

    // Watch for changes in the selected option to update departments
    $scope.$watch('selectedOption', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.updateDepartments();
            $scope.selectedDoption='---';
            $timeout(function() {
                var current = document.getElementById('exams');
                if (current) {
                    current.innerHTML = '';
                }
            }, 0); // 0 ms delay to push it to the end of the digest cycle

        }
    });
    //SHOW LIST OF COURSES FOR THE SELECTED DEPARTMENT
    var current = document.getElementById('exams'); 
    function changeCourses(){     
        
        $scope.acoursesbox=[];
        $scope.acourses=[];
        var current = document.getElementById('exams');    
            $scope.faculty.forEach(element =>{
                if(element.department ===$scope.selectedDoption){
                    $scope.acoursesbox.push(element.courses);
                    
                    
                }
            });
            $scope.acourses=$scope.acoursesbox[0];
            $scope.acourses=$scope.acourses.split(',');
            console.log($scope.acoursesbox);
            console.log($scope.acourses);
            console.log($scope.acourses.length);
            var current = document.getElementById('exams');
            current.innerHTML = '';
            $scope.acourses.forEach(item => {
            var newDiv = document.createElement('div');
            newDiv.className = 'course';
            newDiv.textContent = item;
            newDiv.draggable = true;
            newDiv.id = item; // Keep the same ID or generate a new unique ID

            // Add event listeners to the new course element
            newDiv.addEventListener('dragstart', dragStart);
            

            // Append the new course element to the courses container
            current.appendChild(newDiv);
            });

        
        

    }
    //Watch for changes in the doptions
    $scope.$watch('selectedDoption', function(newVal, oldVal) {
        if (newVal !== oldVal && newVal!='---') {
            current.innerHTML='';
            console.log($scope.selectedDoption);
            changeCourses();
        }
    });

    
    }, function(error) {
        console.error('Error fetching faculty data:', error);
        }
     );
    
   
    //ENSURE THE INITIALIZED DRAG AND DROP IS INITIATED AFTER NG-INCLUDE
    $scope.$on('$includeContentLoaded', function() {
        $timeout(initializeDragAndDrop, 0);
    });
    
    //FUNCTION FOR INITIALIZED DRAG AND DROP FUNCTION
    function initializeDragAndDrop() {
        const courses = document.querySelectorAll('.course');
        const slots = document.querySelectorAll('.time-slot');
        //cc make it possible to drop back
        var currentid='cc';
        const coursescontainer=document.getElementById('cc');
        coursescontainer.addEventListener('dragover', dragOver);
        coursescontainer.addEventListener('drop', drop);
        console.log('initializing....');   
        if(courses){
            console.log(courses);
        }     
        // Add dragstart event listener to each course element
        courses.forEach(course => {
            course.addEventListener('dragstart', dragStart);
            console.log('drag start initialised....');
        });
       
        // Add dragover and drop event listeners to each time-slot element
        slots.forEach(slot => {
            slot.addEventListener('dragover', dragOver);
            slot.addEventListener('drop', drop);
            console.log('dragover and drop initialised....');
        });
    }
    // Function to handle dragstart event
    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        console.log('picked up item....');
    }

    // Function to handle dragover event
    function dragOver(e) {
        e.preventDefault();
        console.log('you can place item....');
    }

    // Function to handle drop event
    function drop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text');
        var textNode = document.createTextNode(id);
        var len = e.target.childNodes.length;
        let brElement = document.createElement('br');
        if ((e.target.classList.contains('time-slot') && len < 8)) {
            e.target.appendChild(textNode);
            e.target.appendChild(brElement);
            
        }
        console.log('droped....');
    }
    //FUNCTION TO CLEAR ALL TABLE DATA
    $scope.clearContent = function() {
		var tobecleared =  document.querySelectorAll('.time-slot');
        tobecleared.forEach(element => {
            element.innerHTML = '';
        });
    } ;  //END OF CLEAR ALL FUNCTION

    //REMOVE-BUTTON FUNCTION
    $scope.removeContent = function() {
		var toberemoved =  document.querySelectorAll('.selected');
        toberemoved.forEach(element => {
            element.innerHTML = '';
        });
    };
			
	let selectedElement = null;
    
    // Function to handle click event
    $scope.handleClick = function(event) {
		//DESELECIING PART
		if (event.target === selectedElement) {
        // Remove the 'selected' class from the currently selected element
        selectedElement.classList.remove('selected');
        // Set selectedElement to null to indicate nothing is selected
        selectedElement = null;
    } else {
        // Remove the 'selected' class from the previously selected element, if any
        if (selectedElement) {
			
            selectedElement.classList.remove('selected');
        }
		
        
        // Store the clicked element in the variable
        selectedElement = event.target;
        // Add the 'selected' class to the clicked element
        selectedElement.classList.add('selected');

        // For demonstration, log the text content of the selected element
        console.log('Selected element:', selectedElement.textContent);
		
      }
	}
    //FUNCTION TO EXPORT TABLE AND DOWNLOAD
	$scope.exportTableToExcel = function(filename) { 
        let table = document.getElementById("tbb");
        let wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
        XLSX.writeFile(wb, filename);
        console.log('exported');
    }

}]);