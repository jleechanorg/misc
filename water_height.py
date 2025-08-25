"""
Of course. Here are a few sample inputs to test your code, ranging from simple cases to trickier ones.

## 1. Standard Case
Input: height = [1, 8, 6, 2, 5, 4, 8, 3, 7]

Expected Output: 49
(The pair (8, 7) with a width of 7 gives 7 * 7 = 49)

## 2. Ascending Heights
This tests if your logic correctly handles a steady increase.

Input: height = [1, 2, 3, 4, 5, 6]

Expected Output: 9
(The pair (3, 6) with a width of 3 gives 3 * 3 = 9)

## 3. Tall Walls on the Outside
This tests if your code correctly identifies that the widest container is sometimes the best.

Input: height = [8, 1, 1, 1, 1, 1, 1, 8]

Expected Output: 56
(The pair (8, 8) with a width of 7 gives 7 * 8 = 56)

## 4. Tall Wall in the Middle
This is a good tricky case. The optimal solution does not involve the widest container.

Input: height = [4, 1, 9, 1, 4]

Expected Output: 16
(The pair (4, 4) with a width of 4 gives 4 * 4 = 16)

## 5. Two Elements
A simple edge case.

Input: height = [5, 10]

Expected Output: 5
(The pair (5, 10) with a width of 1 gives 1 * 5 = 5)
"""

def water(h):
    left = 0
    right = len(h) - 1

    maxArea = 0
    maxL = maxR = -1
    while (right >= left):
        area = calcArea(left, right, h)
        if area > maxArea:
            maxArea = area
            maxL = left
            maxR = right
        if h[left] > h[right]:
            right -= 1
        else:
            left += 1
    
    return maxL, maxR, maxArea

def calcArea(left, right, h):
    w = right - left
    hleft = h[left]
    hright = h[right]
    h = min(hleft, hright)
    return w * h

def test(h):
    left, right, area = water(h)
    print left
    print right
    print area

## 1. Standard Case
#Input: height = [1, 8, 6, 2, 5, 4, 8, 3, 7]

#Expected Output: 49
#(The pair (8, 7) with a width of 7 gives 7 * 7 = 49)
#test([1, 8, 6, 2, 5, 4, 8, 3, 7])

## 2. Ascending Heights
#This tests if your logic correctly handles a steady increase.

#Input: height = [1, 2, 3, 4, 5, 6]
#test([1, 2, 3, 4, 5, 6])

#Expected Output: 9
#(The pair (3, 6) with a width of 3 gives 3 * 3 = 9)

## 3. Tall Walls on the Outside
#This tests if your code correctly identifies that the widest container is #sometimes the best.

#Input: height = [8, 1, 1, 1, 1, 1, 1, 8]

#Expected Output: 56
#(The pair (8, 8) with a width of 7 gives 7 * 8 = 56)

## 4. Tall Wall in the Middle
#This is a good tricky case. The optimal solution does not involve the #widest container.

#Input: height = [4, 1, 9, 1, 4]

#Expected Output: 16
#(The pair (4, 4) with a width of 4 gives 4 * 4 = 16)

## 5. Two Elements
#A simple edge case.

#Input: height = [5, 10]

#Expected Output: 5
#(The pair (5, 10) with a width of 1 gives 1 * 5 = 5)