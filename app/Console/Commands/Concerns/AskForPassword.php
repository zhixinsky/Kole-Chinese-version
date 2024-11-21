<?php

namespace App\Console\Commands\Concerns;

/**
 * @method void  error($message, $verbosity = null)
 * @method mixed secret($message, $fallback = true)
 */
trait AskForPassword
{
    private function askForPassword(): string
    {
        do {
            $password = $this->secret('您想要的密码');

            if (!$password) {
                $this->error('密码不能为空。');
                continue;
            }

            $confirmedPassword = $this->secret('再次确认');
        } while (!$this->comparePasswords($password, $confirmedPassword ?? null));

        return $password;
    }

    private function comparePasswords(?string $password, ?string $confirmedPassword): bool
    {
        if (!$password || !$confirmedPassword) {
            return false;
        }

        if (strcmp($password, $confirmedPassword) !== 0) {
            $this->error('密码不匹配。请重试?');

            return false;
        }

        return true;
    }
}
