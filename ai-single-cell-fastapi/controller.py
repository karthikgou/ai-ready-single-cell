from fastapi import FastAPI, WebSocket
from celery.result import AsyncResult
import uvicorn
import scanpy as sc
import asyncio
from fastapi.middleware.cors import CORSMiddleware


from services import *

app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/ScanpyQC')
def processScanpy(username: str):
    task = processScanpyQC.delay(username)
    return {'taskId': task.task_id}

@app.get('/DropkickQC')
def processDropkick(username: str):
    task = processDropkickQC.delay(username)
    return {'taskId': task.task_id}

@app.get('/FailingTask')
def processFail(username: str):
    task = processFailingTask.delay(username)
    return {'taskId': task.task_id}

@app.websocket("/taskStatus/{taskIdsCommaSeparated}")
async def websocket_endpoint(websocket: WebSocket, taskIdsCommaSeparated: str):
    await websocket.accept()
    while True:
        taskIds = taskIdsCommaSeparated.split(',')
        results = {}

        for taskId in taskIds:
            result = AsyncResult(taskId)
            if result.ready():
                if result.successful():
                    results[taskId] = 'complete'
                else:
                    results[taskId] = 'fail'
            else:
                results[taskId] = 'in_progress'
        await websocket.send_json(results)
        await asyncio.sleep(3)



if __name__ == '__main__':
    print("Uvicorn running")
    uvicorn.run(app)