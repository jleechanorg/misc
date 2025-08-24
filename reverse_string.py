def reverse(input):
    words = input.split(" ")
    reversed_words = reversed(words)
    return " ".join(reversed_words)

print reverse("I am a big apple")
