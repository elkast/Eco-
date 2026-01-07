"""
Configuration Celery pour les tâches asynchrones
Permet d'envoyer des emails en arrière-plan sans bloquer l'utilisateur
"""
from celery import Celery
from flask import Flask


def creer_celery_app(app: Flask = None) -> Celery:
    """
    Factory pour créer l'application Celery
    """
    celery = Celery(
        app.import_name if app else 'eco_holding',
        broker=app.config.get('CELERY_BROKER_URL', 'redis://localhost:6379/0') if app else 'redis://localhost:6379/0',
        backend=app.config.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0') if app else 'redis://localhost:6379/0',
        include=['tasks.email_tasks']
    )
    
    if app:
        celery.conf.update(app.config)
        
        class ContextTask(celery.Task):
            def __call__(self, *args, **kwargs):
                with app.app_context():
                    return self.run(*args, **kwargs)
        
        celery.Task = ContextTask
    
    # Configuration des tâches périodiques
    celery.conf.beat_schedule = {
        'relancer-demandes-non-traitees': {
            'task': 'tasks.email_tasks.relancer_demandes_non_traitees',
            'schedule': 86400.0,  # Tous les jours (86400 secondes)
        },
    }
    
    return celery