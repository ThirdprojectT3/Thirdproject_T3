
import time

def timeit(func):
    def wrapper(input):
        start = time.time()
        result = func(input)
        print(f"{func.__name__} took {time.time() - start:.2f} sec")
        return result
    return wrapper