<?php

namespace App\Traits;

use App\Models\ActivityLog;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        static::created(function ($model) {
            $model->logActivity('created');
        });

        static::updated(function ($model) {
            $model->logActivity('updated');
        });

        static::deleted(function ($model) {
            $model->logActivity('deleted');
        });
    }

    public function logActivity($action)
    {
        $description = $this->getActivityDescription($action);
        
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'model_type' => get_class($this),
            'model_id' => $this->id,
            'description' => $description,
            'old_values' => $action === 'updated' ? $this->getOriginal() : null,
            'new_values' => $action === 'updated' ? $this->getAttributes() : $this->getAttributes(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    protected function getActivityDescription($action)
    {
        $modelName = class_basename($this);
        $identifier = $this->getActivityIdentifier();

        return "{$modelName} {$identifier} a été {$action}";
    }

    protected function getActivityIdentifier()
    {
        $attributes = ['name', 'title', 'email', 'id'];
        
        foreach ($attributes as $attribute) {
            if (isset($this->$attribute)) {
                return $this->$attribute;
            }
        }

        return $this->id;
    }
}