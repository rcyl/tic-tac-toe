

var main = function(){

    var grid, count, n, inPlay, com, pla;

    $("#btn-player").click(function(){
        inPlay = true;
        com = 'O';
        pla = 'X';
        init();
        $(".btn").hide();
    })

    $("#btn-com").click(function(){
        inPlay = true;
        com = 'X';
        pla = 'O';
        init();
        $(".btn").hide();
        place(initial());
    })

    $("td").click(function(){
        if (inPlay){
            $(this).unbind('mouseover', mouseOver).unbind('mouseout', mouseOut);
            $(this).text(pla);
            $(this).css("color", "rgba(0,0,0,1");

            var id = this.id;            

            grid[Math.floor(id/n)][id%n] = pla;
            count++;

            if (count==n*n) {
                $(".btn").show();
                inPlay = false;
            }

            var pos = -1;
            if (count >2 ) pos = traverse(id);
            else pos = initial();

            place(pos);

            if (count==n*n) {
                $(".btn").show();
                inPlay = false;
            }
        }
    })

    function mouseOver() {
        $(this).css("color", "rgba(0,0,0,0.3");
        $(this).text(pla);
    }
    function mouseOut(){
        $(this).css("color", "rgba(0,0,0,1");
        $(this).text("");
    }

    var init = function(){
        grid = [];
        count = 0;
        n = 3 ;
        inPlay = true;

        for(var i=0;i<n;i++){
            grid[i] = [];
            for(var j=0;j<n;j++){
                grid[i][j] = '';
            }
        }
        $("td").text("");
        $("td").bind('mouseover', mouseOver).bind('mouseout', mouseOut);
    }

    var initial = function(){
        if (grid[1][1] == '') return n+1;
        if (grid[0][0] == '') return 0;
        if (grid[0][n-1] == '') return n-1;
        if (grid[n-1][0] == '') return (n-1)*n;
        return (n-1)*n+(n-1);
    }

    var traverse = function(id){
        var max = -1, index = -1, points = 0;
        for(var i=0;i<n;i++){
            for(var j=0;j<n;j++){
                if (grid[i][j] !== '') { continue; }
                points = calc(i,j); 
                if (points == 6) return i*n+j;
                if (points > max) {
                    max = points;
                    index = i*n+j;
                }
            }
        }
        return index;
    }

    var hor = function(i,j){
        var countC = 0; countP = 0;
        for(var k=0;k<n;k++) {
            if (grid[i][k]==com) countC++;
            else if (grid[i][k]==pla) countP++;
        }
        return points(countC, countP);
    }

    var ver = function(i, j){
        var countC = 0; countP = 0;
        for(var k=0;k<n;k++) {
            if (grid[k][j]==com) countC++;
            else if (grid[k][j]==pla) countP++;
        }
        return points(countC, countP); 
    }

    var diag = function(i, j){
        if (i!=j) return 0;
        var countC = 0; countP = 0; 
        for(var k=0;k<n;k++) {
            if (grid[k][k]==com) countC++;
            else if (grid[k][k]==pla) countP++;
        }
        return points(countC, countP);
    }

    var rdiag = function(i, j){
        if (i+j!=n-1) return 0;
        var countC = 0; countP = 0; 
        for(var k=0;k<n;k++) {
            if (grid[k][n-1-k]==com) countC++;
            else if (grid[k][n-1-k]==pla) countP++;
        }
        return points(countC, countP);
    }

    var calc = function(i,j){
        var points = 0, countP = 0, countC = 0;

        points += hor(i, j);
        points += ver(i, j);
        points += diag(i, j);
        points += rdiag(i, j);

        return points;
    }

    var points = function(countC, countP){

        if (countC == 2 && countP == 0) return 6; //win
        if (countC == 0 && countP == 2) return 5; //block
        if (countC == 1 && countP == 0) return 2; //fork
        //if (countC == 0 && countP == 1) return 1; //block fork
        return 0; 
    }

    var place = function(pos){
        var cur = $("#" + pos);
        grid[Math.floor(pos/n)][pos%n] = com;
        count++;
        cur.text(com);
        cur.unbind('mouseover', mouseOver).unbind('mouseout', mouseOut);
    }

}

$(document).ready(main);
