/**
 * Created with JetBrains WebStorm.
 * User: bmd1
 * Date: 08/09/12
 * Time: 23:55
 * To change this template use File | Settings | File Templates.
 */
var timeout=0;
var baseURL="https://api.github.com/";
var userURL="users/"

function ViewModel(){
    var self = this;

    self.searchTerm=ko.observable();
    self.searchTypes=ko.observableArray(['User', 'Team', 'Organisation']);
    self.selectedSearchType=ko.observable('User');
    self.user=ko.observable();
    self.team=ko.observable();
    self.repo=ko.observableArray([]);

    self.search=function(){
        if (self.searchTerm().length>3)
        {
            //timeout
            clearTimeout(timeout);
            timeout=setTimeout(function(){
                carryOutGitHubSearch(self.selectedSearchType(),self.searchTerm());
            },500);


        }
    },

    self.logModel=function()
    {
        console.log("Search Term "+self.searchTerm());
        console.log("Selected Search "+self.selectedSearchType());
        console.log("User "+self.user.name());
        //iterate through repos
    }

};

$(function(){
    infuser.defaults.templateSuffix = ".tmpl.html";
    infuser.defaults.templateUrl = "templates";
    window.vm=new ViewModel();
    ko.applyBindings(vm);
    window.vm.selectedSearchType.subscribe(function(newValue) {
        carryOutGitHubSearch(newValue,window.vm.searchTerm());
    });
});



function getRepos()
{
    clearTimeout(timeout);
    timeout=setTimeout(function()
    {
        retrieveUsersGitHubRepos(window.vm.searchTerm());
    },500);
}

function retrieveUsersGitHubRepos(searchTerm)
{
    if(window.vm.searchTerm()!=null){
        //console.log(searchType+" "+searchTerm);

        ///users/:user/repos
        var url=baseURL+userURL+searchTerm+"/repos";
        //var url="https://api.github.com?callback=foo&Origin=http://www.scottishcodemonkey.com";
        /*
         $.getJSON(url, function(data){

         if(data.stat == "ok") {
         //console.log(data);
         // Map the results
         //ko.mapping.fromJS(data.user, photoMappingOptions, viewModel.user);
         }
         });*/
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'listReposCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            success: null,
            error:null,
            traditional:true,
            crossDomain:true
        });
    }
}

function carryOutGitHubSearch(searchType,searchTerm)
{
    if(window.vm.searchTerm()!=null){
        console.log(searchType+" "+searchTerm);
        var url=baseURL+userURL+searchTerm;
        //var url="https://api.github.com?callback=foo&Origin=http://www.scottishcodemonkey.com";
        /*
        $.getJSON(url, function(data){

            if(data.stat == "ok") {
                //console.log(data);
                // Map the results
                //ko.mapping.fromJS(data.user, photoMappingOptions, viewModel.user);
            }
        });*/
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'searchCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            success: null,
            error:null,
            crossDomain:true

        });
    }
}

function searchCallback(response) {
    var meta = response.meta;
    window.vm.user=ko.mapping.fromJS(response.data);
    //console.log(meta);
    //console.log(response.data);
    ko.applyBindings(window.vm);
    window.vm.logModel();
}

//http://jsfiddle.net/rniemeyer/tD4pH/
function listReposCallback(response)
{
    var meta = response.meta;
    window.vm.repo=ko.mapping.fromJS(response.data);
    //console.log(meta);
    ko.applyBindings(window.vm);
    window.vm.logModel();
}
