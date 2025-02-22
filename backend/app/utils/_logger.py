"""Custom logging module."""

import logging


def get_handlers(
    filename: str = "app.log",
    mode: str = "w",
    file_level: int = logging.DEBUG,
    stderr_level: int = logging.DEBUG,
) -> tuple[logging.Handler, logging.Handler]:
    """Returns stream and file handlers with specified logging levels and formatters.

    The function configures and returns two logging handlers: a StreamHandler for
    stderr output and a FileHandler for file-based logging, both with custom
    formatting and specified logging levels.

    Args:
        filename: Name of the log file for writing messages. Defaults to "app.log".
        mode: File opening mode, "w" for write (truncates existing). Defaults to "w".
        file_level: Logging level for file handler. Defaults to logging.DEBUG.
        stderr_level: Logging level for stderr handler. Defaults to logging.DEBUG.

    Returns:
        tuple[logging.Handler, logging.Handler]: A tuple containing (stderr_handler,
        file_handler) configured with specified levels and formatters.
    """
    # +----------------+
    # | stream handler |
    # +----------------+
    stderr_handler = logging.StreamHandler()
    stderr_handler.setLevel(stderr_level)
    stderr_handler.setFormatter(CustomFormatter())

    # +--------------+
    # | file handler |
    # +--------------+
    file_handler = logging.FileHandler(filename, mode=mode)
    file_handler.setLevel(file_level)
    file_handler.setFormatter(CustomFormatter(True))

    return stderr_handler, file_handler


class CustomFormatter(logging.Formatter):
    """A custom log formatter that adds color to log messages based on the log level.

    Args: file (bool): Indicates whether the log is being written to a file.
    Default is False.

    Attributes: FORMATS (dict): A dictionary mapping log levels to colorized log
    message formats.

    Methods: format(record): Formats the log record with the appropriate
    colorized log message format.

    """

    def __init__(self, file: bool = False) -> None:
        """Initialize the CustomFormatter.

        Initializes the formatter with color settings based on whether the output
        is directed to a file. If `file` is True, color codes are suppressed.

        Args:
            file: Whether the log is being written to a file. Defaults to False.
        """
        super().__init__()
        yellow = "" if file else "\x1b[36;10m"
        blue = "" if file else "\x1b[35;10m"
        green = "" if file else "\x1b[32;10m"
        red = "" if file else "\x1b[31;10m"
        bold_red = "" if file else "\x1b[31;1m"
        reset = "" if file else "\x1b[0m"
        log = "%(asctime)s (%(filename)s:%(lineno)d) - %(levelname)s: "
        msg = f"{reset}%(message)s"

        self.FORMATS = {
            logging.DEBUG: blue + log + msg,
            logging.INFO: green + log + msg,
            logging.WARNING: yellow + log + msg,
            logging.ERROR: red + log + msg,
            logging.CRITICAL: bold_red + log + msg,
        }

    def format(self, record: logging.LogRecord) -> str:
        """Formats the log record with the appropriate colorized log message format.

        Args:
            record (LogRecord): The log record to be formatted.

        Returns:
            str: The formatted log message.

        """
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)


def init_logging_config(
    basic_log_level: int = logging.INFO,
    filename: str = "app.log",
    mode: str = "w",
    file_level: int = logging.DEBUG,
    stderr_level: int = logging.DEBUG,
) -> None:
    """Initialize logging configuration.

    Sets up logging handlers for stderr and a file, allowing for different
    logging levels for each. Removes any existing handlers to avoid conflicts.


    Args:
        basic_log_level: The `basic_log_level` parameter is used to set the
        logging level for the root logger. In this function, it is set to
        `logging.INFO` by default, which means that log messages with severity
        level INFO or higher will be processed.

        filename: The `filename` parameter is a string that specifies the name of
        the log file where the logs will be written. In the `init_logging_config`
        function you provided, the default value for `filename` is "app.log".
        This means that if no filename is provided when calling the function,
        logs. Defaults to app.log

        mode: The `mode` parameter in the `init_logging_config` function specifies
        the mode in which the log file will be opened. In this case, the default
        value is "w" which stands for write mode. This means that the log file
        will be opened for writing, and if the file already exists. Defaults to w

        file_level: The `file_level` parameter in the `init_logging_config`
        function is used to specify the logging level for the file handler. This
        determines the severity level of log messages that will be written to the
        log file specified by the `filename` parameter. In this case, the default
        value for `file

        stderr_level: The `stderr_level` parameter in the `init_logging_config`
        function is used to specify the logging level for the stderr (standard
        error) handler. This handler is responsible for directing log messages to
        the standard error stream. The logging level determines which severity of
        log messages will be output to the stderr.
    """
    logger = logging.getLogger()

    # remove all existing handlers (fastapi's default)
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)

    logger.setLevel(basic_log_level)

    # get the handlers
    stderr_handler, file_handler = get_handlers(
        file_level=file_level,
        stderr_level=stderr_level,
        filename=filename,
        mode=mode,
    )

    # add the handlers
    logger.addHandler(stderr_handler)
    logger.addHandler(file_handler)

    logger.propagate = False
