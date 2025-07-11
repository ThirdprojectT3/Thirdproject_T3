import time
import asyncio
import functools

def timeit(func):
    if asyncio.iscoroutinefunction(func):  # 비동기 함수인 경우
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            start = time.time()
            result = await func(*args, **kwargs)
            print(f"[ASYNC] {func.__name__} took {time.time() - start:.2f} sec")
            return result
        return async_wrapper
    else:  # 동기 함수인 경우
        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            start = time.time()
            result = func(*args, **kwargs)
            print(f"[SYNC] {func.__name__} took {time.time() - start:.2f} sec")
            return result
        return sync_wrapper
