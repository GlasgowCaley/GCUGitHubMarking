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
var reposURl="repos"

function ViewModel(){
    var self = this;

    self.searchTerm=ko.observable();
    self.searchTypes=ko.observableArray(['User', 'Team', 'Organisation']);
    self.selectedSearchType=ko.observable('User');
    self.user=ko.observable();
    self.team=ko.observable();
    self.repo=ko.observableArray([]);
    self.commits=ko.observableArray([]);


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
        //iterate through commits
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

function getCommits()
{
    clearTimeout(timeout);
    timeout=setTimeout(function()
    {
        retrieveReposCommits("gp2");
    },500);
}

function getRepos()
{
    clearTimeout(timeout);
    timeout=setTimeout(function()
    {
        retrieveUsersGitHubRepos(window.vm.searchTerm());
    },500);
    //getCommits();
}

function retrieveReposCommits(repoName)
{
    console.log("Get Repos "+repoName);
    if(window.vm.searchTerm()!=null){
        var url=baseURL+reposURl+window.vm.user().name+"/"+repoName+"/commits";
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'listCommitsCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            success: null,
            error:null,
            traditional:true,
            crossDomain:true
        });
    }
}

function retrieveUsersGitHubRepos(searchTerm)
{
    if(window.vm.searchTerm()!=null){
        var url=baseURL+userURL+searchTerm+"/repos";
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
    ko.applyBindings(window.vm);
    window.vm.logModel();
}

//http://jsfiddle.net/rniemeyer/tD4pH/
function listReposCallback(response)
{
    var meta = response.meta;
    window.vm.repo=ko.mapping.fromJS(response.data);
    ko.applyBindings(window.vm);
    window.vm.logModel();
}

function listCommitsCallback(response)
{
    var meta=response.meta;
    window.vm.commits=ko.mapping.fromJS(response.data);
    ko.applyBindings(window.vm);
    windows.vm.logModel();
}
