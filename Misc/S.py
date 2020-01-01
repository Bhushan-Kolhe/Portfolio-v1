from tkinter import *
from tkinter.filedialog import askopenfilename
import random
import threading
import time

event2canvas = lambda e, c: (c.canvasx(e.x), c.canvasy(e.y))

class Game:
    def __init__(self):
        self.inGame = True
        self.width = 700
        self.height = 700
        self.blockSize = 10
        self.score = 0
        self.bgColor = "#323032"
        self.fruitColor = "#f71e5c"
        self.UP = 'Up'
        self.DOWN = 'Down'
        self.RIGHT = 'Right'
        self.LEFT = 'Left'
        self.snakeLength = 3
        self.refreshTime = 100
        self.directions = [[0,-1],[0,1],[1,0],[-1,0]]
        self.currentDirection = self.directions[0]
        self.snake = [[(self.width/self.blockSize)/2 , (self.height/self.blockSize)/2],[(self.width/self.blockSize)/2 , (self.height/self.blockSize)/2 + 1], [(self.width/self.blockSize)/2 , (self.height/self.blockSize)/2 +2]]
        self.snakeTail = []
        self.snakeHead = []
        self.root = Tk()
        self.root.title("Snake Game")
        self.frame = Frame(self.root, bd=2, relief=SUNKEN)
        self.frame.grid(column=0, row=0)
        self.canvas = Canvas(self.frame, bd=0, bg=self.bgColor)
        self.canvas.grid(row=0, column=0)
        self.root.resizable(False, False)
        self.canvas.config(width=self.width, height=self.height)
        #self.root.bind("<Key>", game.redirect)
        for i in self.snake:
            self.canvas.create_rectangle(i[0] * self.blockSize,i[1] * self.blockSize, i[0]*self.blockSize + self.blockSize, i[1]*self.blockSize + self.blockSize, fill='white', outline=self.bgColor)
        threading.Thread(target=self.Move).start()
        self.root.mainloop()

    def Draw(self):
        time.sleep(1)
        self.canvas.create_rectangle(self.snakeHead[0] * self.blockSize,self.snakeHead[1] * self.blockSize, self.snakeHead[0]*self.blockSize + self.blockSize, self.snakeHead[1]*self.blockSize + self.blockSize, fill='white', outline=self.bgColor)
        self.canvas.create_rectangle(self.snakeTail[0] * self.blockSize,self.snakeTail[1] * self.blockSize, self.snakeTail[0]*self.blockSize + self.blockSize, self.snakeTail[1]*self.blockSize + self.blockSize, fill=self.bgColor, outline='')
        

    def Move(self):
        while True:
            self.snakeTail = self.snake[self.snakeLength-1]
            for i in self.snake:
                i[0] += self.currentDirection[0]
                i[1] += self.currentDirection[1]
            self.snakeHead = self.snake[0]
            self.Draw()
            
            
            




g = Game()
