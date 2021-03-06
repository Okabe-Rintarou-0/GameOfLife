# Game of Life
The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton 
Conway in 1970. It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no 
further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. 
It is Turing complete and can simulate a universal constructor or any other Turing machine(from [Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)).

# How to
Enter the root directory, then type:
```shell script
npm install
npm start
```

# Rules
The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in 
one of two possible states, live or dead (or populated and unpopulated, respectively). Every cell interacts with its
eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, 
the following transitions occur:

+ Any live cell with fewer than two live neighbours dies, as if by underpopulation.
+ Any live cell with two or three live neighbours lives on to the next generation.
+ Any live cell with more than three live neighbours dies, as if by overpopulation.
+ Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

These rules, which compare the behavior of the automaton to real life, can be condensed into the following:

+ Any live cell with two or three live neighbours survives.
+ Any dead cell with three live neighbours becomes a live cell.
+ All other live cells die in the next generation. Similarly, all other dead cells stay dead.

The initial pattern constitutes the seed of the system. The first generation is created by applying 
the above rules simultaneously to every cell in the seed, live or dead; births and deaths occur simultaneously, and the
discrete moment at which this happens is sometimes called a tick. 
Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations.
Remember that it is possible that you create a computer based on game of life(from [Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)).

# Examples

+ Fastblinker
  
  ![Fastblinker](readme-images/Fastblinker.gif)

  A very simple oscillator.
  
+ Glider
   
  ![Glider](readme-images/Glider.gif)
  
  An amazing moving cell.
  
+ Move Glider
    
  ![Move Glider](readme-images/Move_glider.gif)
  
  Another form of `glider`.     

+ Gosperglidergun
  
  ![Gosperglidergun](readme-images/Gosperglidergun.gif)
  
  Yes, you can create a gun that can shoot `gliders`.

# More info
+ [Digital Logic Gates on Conway's Game of Life - Part 1](https://nicholas.carlini.com/writing/2020/digital-logic-game-of-life.html)
+ [Implementation of logical functions in the Game of Life](https://www.rennard.org/alife/CollisionBasedRennard.pdf)
+ [All animated images](https://conwaylife.com/wiki/Category:Animated_images)
+ [Wiki](https://conwaylife.com/wiki/Main_Page)
+ [Golly](http://golly.sourceforge.net/)