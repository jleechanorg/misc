"""
## 6. Two Pointers: The "Valid Palindrome" Problem
A palindrome is a word or phrase that reads the same forwards and backward. This problem requires you to check if a string is a palindrome after cleaning it up.

The Problem:
Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.

Clarification: An empty string is considered a valid palindrome.

Examples:

Input: s = "A man, a plan, a canal: Panama"

Expected Output: True
(After cleaning, it becomes "amanaplanacanalpanama", which is a palindrome).

Input: s = "race a car"

Expected Output: False
(After cleaning, it becomes "raceacar", which is not a palindrome).

Input: s = " "

Expected Output: True
(After cleaning, it becomes an empty string "", which is a palindrome).
"""


def palindrome(s):
    # lower
    s = s.lower()

    # Filter
    s_filtered = ""
    for c in s:
        if c.isalnum():
            s_filtered += c
    s = s_filtered
    print 'filtered: ' + s_filtered

    left = 0
    right = len(s) - 1

    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

def test(s):
    print palindrome(s)

test("a")

test("ab")

test("aa")

test("race a car")

test("A man, a plan, a canal: Panama")
