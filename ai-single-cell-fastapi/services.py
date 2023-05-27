import scanpy as sc
from celery import Celery, current_task
import numpy as np
import pandas as pd
import os
import scanpy as sc
import zipfile
import time
import dropkick
import matplotlib.pyplot as plt
import os

sc.settings.verbosity = 3             # verbosity: errors (0), warnings (1), info (2), hints (3)
sc.logging.print_header()
sc.settings.set_figure_params(dpi=80, facecolor='white')

import zipfile
import os.path

celeryApp = Celery('jobQueue', broker = 'redis://localhost:6379/0', backend = 'redis://localhost:6379/0')

@celeryApp.task(name = 'ScanpyQC')
def processScanpyQC(username: str):
    x = [1, 2, 3, 4]
    y = [10, 5, 7, 3]
    fig, ax = plt.subplots()
    ax.plot(x, y)
    if not os.path.exists(f'/app/temp/{current_task.request.id}'):
        os.makedirs(f'/app/temp/{current_task.request.id}')
    fig.savefig(f'/app/temp/{current_task.request.id}/outliers_checking.png')
    with open(f'/app/temp/{current_task.request.id}/log.txt', 'w') as f:
        f.write('ScanPy QC Successful')
        f.close()
    time.sleep(30)
    return "ScanpyTask executed " + username

@celeryApp.task(name = 'DropkickQC')
def processDropkickQC(username: str):
    x = [12, 34, 40, 44]
    y = [9, 29, 44, 47]
    fig, ax = plt.subplots()
    ax.plot(x, y)
    if not os.path.exists(f'/app/temp/{current_task.request.id}'):
        os.makedirs(f'/app/temp/{current_task.request.id}')
    fig.savefig(f'/app/temp/{current_task.request.id}/clusters.png')
    open(os.path.join(os.getcwd(), 'molecules.h5ad'), 'a').close()
    with open(f'/app/temp/{current_task.request.id}/log.txt', 'w') as f:
        f.write('Task Execution Successful')
        f.close()
    time.sleep(50)
    return "DropkickTask executed " + username

@celeryApp.task(name='FailingTask')
def processFailingTask(username: str):
    print('Safafa')
    if not os.path.exists(f'/app/temp/{current_task.request.id}'):
        os.makedirs(f'/app/temp/{current_task.request.id}')
    with open(f'/app/temp/{current_task.request.id}/log.txt', 'w') as f:
        f.write('Exception while dividing by zero')
        f.close()
    time.sleep(60)
    print(1/0)
    