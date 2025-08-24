"""
Alright, let's move on to the "First Unique Character" problem.

## 5. Hash Maps and Frequency: First Unique Character
The Problem:
Given a string s, find the first non-repeating character in it and return its index. If a non-repeating character does not exist, return -1.

Examples:

Input: s = "leetcode"

Expected Output: 0 (for the character 'l')

Input: s = "loveleetcode"

Expected Output: 2 (for the character 'v')

Input: s = "aabb"

Expected Output: -1
"""
def findchar(s):
    charmap = {}
    for c in s:
        if c not in charmap:
            charmap[c] = 1
        else:
            charmap[c] = charmap[c] + 1
    print 'map: ' + str(charmap)

    for i, c in enumerate(s):
        if charmap[c] == 1:
            print "unique: " + c
            return i
    
    return -1

def test(s):
    print findchar(s)

test("leetcode")

test("loveleetcode")

test("aabb")
